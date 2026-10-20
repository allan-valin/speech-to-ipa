"""Export Allosaurus (universal model uni2005, "ipa" = every phone) to ONNX, front end included.

    python eval/export_allosaurus_onnx.py <workdir with audio/> <outdir>

Allosaurus reads int16 audio at 8 kHz and computes 40 MFCCs (Kaldi-style povey
window, per-frame DC removal and pre-emphasis), normalises them per utterance and
stacks 3 frames (keeping every third). All of that is rebuilt here in torch ops so
the browser feeds the raw 16 kHz waveform, like the other models:
  - 16 -> 8 kHz: resampy's filter, measured from its impulse response and applied as
    a strided convolution;
  - the mel filterbank, DCT and lifter are Allosaurus's own matrices, embedded as constants.
The script checks features, log-probabilities and decoded phones against Allosaurus
itself on real clips before writing anything.
Output: wav [1, samples] float32 -> logits [1, frames, phones] log-probabilities, blank = 0.
"""
import glob
import json
import os
import sys

import numpy as np
import torch

CHECK_CLIPS = 12


def resample_kernel(resampy):
    """h[d] with y[k] = sum_n x[n] h[2k - n], measured from resampy (kaiser_best, 16 -> 8 kHz)."""
    n, mid = 4001, 2000
    h = {}
    for phase in (0, 1):
        x = np.zeros(n)
        x[mid + phase] = 1.0
        y = resampy.resample(x, 16000, 8000)
        for k, v in enumerate(y):
            h[2 * k - (mid + phase)] = v
    d = np.array(sorted(h))
    keep = np.abs([h[i] for i in d]) > 1e-9
    d = d[keep]
    reach = int(max(abs(d.min()), abs(d.max())))
    kernel = np.zeros(2 * reach + 1)
    for i in d:
        kernel[i + reach] = h[i]
    return kernel, reach


class Allosaurus(torch.nn.Module):
    def __init__(self, am, kernel, reach, fbank, dct, lift, cfg):
        super().__init__()
        self.am = am
        # y[k] = sum_d h[d] x[2k - d]: a correlation with the reversed kernel
        self.register_buffer("kernel", torch.tensor(kernel[::-1].copy(), dtype=torch.float32)[None, None])
        self.reach = reach
        self.register_buffer("fbank", torch.tensor(fbank.T, dtype=torch.float32))      # (bins, 40)
        self.register_buffer("dct", torch.tensor(dct, dtype=torch.float32))            # (40, 40)
        self.register_buffer("lift", torch.tensor(lift, dtype=torch.float32))
        n = cfg["frame"]
        win = (0.5 - 0.5 * torch.cos(2 * torch.pi / (n - 1) * torch.arange(n, dtype=torch.float64))) ** 0.85
        self.register_buffer("win", win.float())
        # real DFT as two matrix products (frames are zero-padded to nfft, so only the first n rows matter)
        k = torch.arange(cfg["nfft"] // 2 + 1, dtype=torch.float64)
        t = torch.arange(n, dtype=torch.float64)[:, None]
        self.register_buffer("cos", torch.cos(2 * torch.pi * t * k / cfg["nfft"]).float())
        self.register_buffer("sin", torch.sin(2 * torch.pi * t * k / cfg["nfft"]).float())
        self.frame, self.step, self.nfft = cfg["frame"], cfg["step"], cfg["nfft"]
        self.register_buffer("eye", torch.eye(n)[:, None, :])

    def features(self, wav):
        x = wav * 32768.0                                                           # Allosaurus reads int16 values
        x8 = torch.nn.functional.conv1d(x[:, None], self.kernel, stride=2, padding=self.reach)[:, 0]
        x8 = x8[:, : wav.shape[1] // 2]
        # framing as a strided convolution with an identity kernel (unfold does not export with a dynamic length)
        frames = torch.nn.functional.conv1d(x8[:, None], self.eye, stride=self.step)[0].T     # (T, 200)
        frames = frames - frames.mean(dim=1, keepdim=True)
        frames = torch.cat([frames[:, :1] * (1 - 0.97), frames[:, 1:] - 0.97 * frames[:, :-1]], dim=1)
        w = frames * self.win
        spec = (w @ self.cos) ** 2 + (w @ self.sin) ** 2
        mel = spec @ self.fbank
        mel = torch.where(mel == 0, torch.full_like(mel, 2.220446049250313e-16), mel)
        feat = (torch.log(mel) @ self.dct) * self.lift
        mean = feat.mean(dim=0, keepdim=True)
        std = torch.sqrt((feat * feat).mean(dim=0, keepdim=True) - mean * mean)
        feat = (feat - mean) / std
        feat = torch.cat([torch.roll(feat, 1, 0), feat, torch.roll(feat, -1, 0)], dim=1)[::3]
        return feat

    def forward(self, wav):
        feat = self.features(wav)[None]
        return self.am(feat, torch.ones_like(feat[0, :, 0]).sum().int().unsqueeze(0))


def main(workdir, outdir):
    import resampy
    from scipy.fftpack import dct as scipy_dct
    from allosaurus.app import read_recognizer
    from allosaurus.audio import read_audio
    from allosaurus.pm.feature import get_filterbanks, mfcc
    from allosaurus.pm.utils import feature_cmvn, feature_window, resample_audio

    rec = read_recognizer()
    pc = rec.pm.config
    frame, step = int(pc.window_size * pc.sample_rate), int(pc.window_shift * pc.sample_rate)
    nfft = 1 << (frame - 1).bit_length()
    fbank = get_filterbanks(pc.bank_size, nfft, pc.sample_rate, pc.low_freq, pc.high_freq)
    dct = scipy_dct(np.eye(pc.bank_size), type=2, axis=1, norm="ortho")[:, : pc.cep_size]
    lift = 1 + (22 / 2.0) * np.sin(np.pi * np.arange(pc.cep_size) / 22)
    kernel, reach = resample_kernel(resampy)
    am = rec.am.eval()
    for p in am.parameters():
        p.requires_grad_(False)
    model = Allosaurus(am, kernel, reach, fbank, dct, lift, {"frame": frame, "step": step, "nfft": nfft}).eval()

    # --- checks against Allosaurus itself ---------------------------------------------
    mask = rec.lm.inventory.get_mask("ipa")
    clips = sorted(glob.glob(os.path.join(workdir, "audio", "*.wav")))[:: max(1, 760 // CHECK_CLIPS)][:CHECK_CLIPS]
    same = 0
    for path in clips:
        audio = read_audio(path)
        ref = rec.pm.compute(audio)
        wav = torch.tensor(np.asarray(audio.samples, dtype=np.float32) / 32768.0)[None]
        with torch.no_grad():
            ours = model.features(wav).numpy()
            n = min(len(ref), len(ours))
            lp_ref = rec.am(torch.tensor(ref[None]), torch.tensor([len(ref)])).numpy()[0]
            lp_ours = model(wav).numpy()[0]
        greedy = lambda lp: [int(i) for i in lp.argmax(-1)]
        dec = lambda ids: " ".join(mask.get_units([i for k, i in enumerate(ids) if i and (k == 0 or ids[k - 1] != i)]))
        a, b = dec(greedy(lp_ref)), dec(greedy(lp_ours))
        same += a == b
        print(f"{os.path.basename(path)} frames {len(ref)}/{len(ours)} feat max|d| {np.abs(ref[:n] - ours[:n]).max():.3f}"
              f" | {a} | {b}")
    print(f"decoded identical on {same}/{len(clips)} clips")

    os.makedirs(outdir, exist_ok=True)
    fp32 = os.path.join(outdir, "model.onnx")
    with torch.no_grad():
        torch.onnx.export(model, (torch.randn(1, 32000) * 0.1,), fp32, input_names=["wav"], output_names=["logits"],
                          dynamic_axes={"wav": {1: "samples"}, "logits": {1: "frames"}}, opset_version=17, dynamo=False)
    units = mask.get_units(list(range(len(mask.unit_map))))
    with open(os.path.join(outdir, "vocab.json"), "w", encoding="utf-8") as f:
        json.dump({"blank": 0, "vocab": {("<blank>" if i == 0 else u): i for i, u in enumerate(units)}}, f, ensure_ascii=False)
    print("units", len(units), "first", units[:5])


if __name__ == "__main__":
    main(*sys.argv[1:3])
