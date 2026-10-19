"""Greedy-CTC transcription with an exported raw-waveform ONNX model.

    cd <workdir with scripts/ audio/>
    python /path/to/eval/run_onnx_ctc.py <model.onnx> <ipa_vocab.json> <results name>

This is the decode the web app will do: argmax per frame, merge repeats, drop
blank and special tokens, join the phones.
"""
import glob
import json
import os
import sys

import numpy as np
import onnxruntime as ort

sys.path.insert(0, "scripts")
from run_inference import _load_audio_mono16k, save


def main(model_path, vocab_path, name):
    vocab = json.load(open(vocab_path, encoding="utf-8"))
    id2sym = {i: s for s, i in vocab.items()}
    session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
    outdir = f"results/{name}"
    os.makedirs(outdir, exist_ok=True)
    for audio in sorted(glob.glob("audio/*.wav")):
        wav = _load_audio_mono16k(audio)[None, :].astype(np.float32)
        logits = session.run(["logits"], {"wav": wav})[0][0]
        ids = logits.argmax(-1)
        phones, prev = [], None
        for i in ids:
            sym = id2sym.get(int(i), "")
            if i != prev and not (sym.startswith("<") and sym.endswith(">")):
                phones.append(sym)
            prev = i
        save(outdir, audio, "".join(phones))


if __name__ == "__main__":
    main(*sys.argv[1:4])
