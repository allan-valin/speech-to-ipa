"""Export POWSM's encoder + CTC head (no decoder) to ONNX int8, plus its front end.

    HF_HOME=... python eval/export_powsm_onnx.py <workdir with audio/ scripts/> <outdir>

CTC-only POWSM needs no language token and cannot loop; on the 760-file gold subset
it scored PER 53.2 / PFER 14.7 vs 56.2 / 17.6 with the decoder (docs/M0-RESULTS.md).

The browser computes the features (STFT 512/400/160, centred, Hann; power; 80 mel;
log; global mean/variance normalisation) from web/app/powsm_frontend.json; this
script also writes tests/fixtures/powsm_*.json to check that port. The ONNX graph
takes feats [1, T, 80] + feats_lens [1] and returns CTC logits [1, T', vocab].
"""
import json
import os
import sys

import torch
from espnet2.bin.s2t_inference import Speech2Text

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIPS = ["uralic_hun_016", "sinotibetan_mya_001", "abkhazadyge_abk_001"]


class EncoderCtc(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.encoder, self.ctc_lo = model.encoder, model.ctc.ctc_lo

    def forward(self, feats, feats_lens):
        enc, _, _ = self.encoder(feats, feats_lens)
        return self.ctc_lo(enc)


def features(model, wav):
    feats, lens = model.frontend(wav, torch.tensor([wav.shape[1]]))
    return model.normalize(feats, lens)


def main(workdir, outdir):
    os.makedirs(outdir, exist_ok=True)
    s2t = Speech2Text.from_pretrained("espnet/powsm", device="cpu", task_sym="<pr>")
    model = s2t.s2t_model.eval()
    fe, mvn = model.frontend, model.normalize
    stft = fe.stft
    win = torch.hann_window(stft.win_length)                  # torch.stft centres it in n_fft
    left = (stft.n_fft - stft.win_length) // 2
    window = [0.0] * left + win.tolist() + [0.0] * (stft.n_fft - stft.win_length - left)
    melmat = fe.logmel.melmat.T                               # (80, 257)
    filters = []
    for row in melmat:
        nz = torch.nonzero(row).flatten().tolist()
        filters.append({"start": nz[0], "weights": row[nz[0]:nz[-1] + 1].tolist()})
    cfg = {"fft": stft.n_fft, "shift": stft.hop_length, "window": window, "filters": filters,
           "mean": mvn.mean.tolist(), "std": mvn.std.tolist(),
           "normMeans": mvn.norm_means, "normVars": mvn.norm_vars}
    assert stft.center and stft.window == "hann" and fe.logmel.log_base is None
    with open(os.path.join(HERE, "web/app/powsm_frontend.json"), "w") as f:
        json.dump(cfg, f)

    sys.path.insert(0, os.path.join(workdir, "scripts"))
    from run_inference import _load_audio_mono16k
    for clip in CLIPS:
        wav = torch.from_numpy(_load_audio_mono16k(os.path.join(workdir, "audio", clip + ".wav"))).unsqueeze(0)
        with torch.no_grad():
            feats, _ = features(model, wav)
        with open(os.path.join(HERE, f"tests/fixtures/powsm_{clip}.json"), "w") as f:
            json.dump({"wav": wav[0].tolist(), "feats": feats[0].tolist()}, f)

    wav = torch.from_numpy(_load_audio_mono16k(os.path.join(workdir, "audio", CLIPS[0] + ".wav"))).unsqueeze(0)
    with torch.no_grad():
        feats, lens = features(model, wav)
    fp32 = os.path.join(outdir, "model.onnx")
    torch.onnx.export(EncoderCtc(model), (feats, lens), fp32,
                      input_names=["feats", "feats_lens"], output_names=["logits"],
                      dynamic_axes={"feats": {1: "T"}, "logits": {1: "frames"}},
                      opset_version=17, dynamo=False)
    from onnxruntime.quantization import QuantType, quantize_dynamic
    quantize_dynamic(fp32, os.path.join(outdir, "model.int8.onnx"), weight_type=QuantType.QInt8)

    toks = s2t.converter.token_list                           # keep phone tokens "/x/" only
    vocab = {t[1:-1]: i for i, t in enumerate(toks) if len(t) > 2 and t[0] == "/" and t[-1] == "/"}
    with open(os.path.join(outdir, "vocab.json"), "w", encoding="utf-8") as f:
        json.dump({"blank": 0, "vocab": vocab}, f, ensure_ascii=False)
    print("phones", len(vocab), "of", len(toks))


if __name__ == "__main__":
    main(*sys.argv[1:3])
