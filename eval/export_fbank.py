"""Dump lhotse's Kaldi-fbank constants (ZIPA's front end) for the browser + test fixtures.

    python eval/export_fbank.py <workdir with audio/>

Writes web/app/fbank80.json (povey window + mel filters, sparse) and
tests/fixtures/fbank_*.json (lhotse features for a few clips) so the JS port is
checked against the real thing.
"""
import json
import os
import sys

import torch
from lhotse.features.kaldi.extractors import Fbank, FbankConfig

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIPS = ["uralic_hun_016", "sinotibetan_mya_001", "abkhazadyge_abk_001"]


def main(workdir):
    ext = Fbank(FbankConfig(num_filters=80, dither=0.0, snip_edges=False))
    layer = ext.extractor
    window = layer.wav2win._window.flatten().tolist()
    fb = layer._fb.detach().numpy()                  # (fft_bins, 80)
    filters = []
    for k in range(fb.shape[1]):
        nz = [i for i in range(fb.shape[0]) if fb[i, k] != 0]
        filters.append({"start": nz[0], "weights": [float(fb[i, k]) for i in range(nz[0], nz[-1] + 1)]})
    with open(os.path.join(HERE, "web/app/fbank80.json"), "w") as f:
        json.dump({"window": window, "fft": 512, "shift": 160, "length": 400,
                   "preemph": 0.97, "eps": float(torch.finfo(torch.float).eps), "filters": filters}, f)
    sys.path.insert(0, os.path.join(workdir, "scripts"))
    from run_inference import _load_audio_mono16k
    os.makedirs(os.path.join(HERE, "tests/fixtures"), exist_ok=True)
    for clip in CLIPS:
        wav = _load_audio_mono16k(os.path.join(workdir, "audio", clip + ".wav"))
        feats = ext.extract_batch([torch.from_numpy(wav).float().unsqueeze(0)], sampling_rate=16000)[0]
        with open(os.path.join(HERE, f"tests/fixtures/fbank_{clip}.json"), "w") as f:
            json.dump({"wav": wav.tolist(), "feats": feats.numpy().tolist()}, f)
    print("fft bins", fb.shape, "window", len(window))


if __name__ == "__main__":
    main(sys.argv[1])
