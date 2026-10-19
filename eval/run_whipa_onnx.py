"""Greedy WhIPA over the exported ONNX graphs — the decode loop the browser runs.

    cd <workdir>; python /path/to/eval/run_whipa_onnx.py <onnx dir> <results name>
"""
import glob
import json
import os
import sys

import numpy as np
import onnxruntime as ort
from transformers import WhisperFeatureExtractor

sys.path.insert(0, "scripts")
from run_inference import _load_audio_mono16k, save


def main(d, name):
    enc_file = os.environ.get("WHIPA_ENCODER", "encoder.onnx")       # int8 encoder hurts (docs/M0-RESULTS.md)
    dec_file = os.environ.get("WHIPA_DECODER", "decoder.int8.onnx")
    enc = ort.InferenceSession(f"{d}/{enc_file}", providers=["CPUExecutionProvider"])
    dec = ort.InferenceSession(f"{d}/{dec_file}", providers=["CPUExecutionProvider"])
    meta = json.load(open(f"{d}/tokens.json", encoding="utf-8"))
    fe = WhisperFeatureExtractor.from_pretrained("openai/whisper-base")
    os.makedirs(f"results/{name}", exist_ok=True)
    for a in sorted(glob.glob("audio/*.wav")):
        wav = _load_audio_mono16k(a)
        hidden = enc.run(["hidden"], {"input_features": fe(wav, sampling_rate=16000, return_tensors="np").input_features})[0]
        ids, cap = list(meta["prompt"]), max(round(len(wav) / 16000), 1) * 20 + 4
        for step in range(cap):
            logits = dec.run(["logits"], {"input_ids": np.array([ids], dtype=np.int64),
                                        "positions": np.arange(len(ids), dtype=np.int64), "hidden": hidden})[0][0, -1]
            logits[meta["suppress"]] = -np.inf
            if step == 0:
                logits[meta["beginSuppress"]] = -np.inf
            nxt = int(logits.argmax())
            if nxt == meta["eos"]:
                break
            ids.append(nxt)
        text = bytes(BYTE_DEC[c] for t in ids[len(meta["prompt"]):] if t < meta["firstSpecial"]
                     for c in meta["tokens"][t]).decode("utf-8", errors="replace")
        save(f"results/{name}", a, text.strip())


def _bytes_to_unicode():
    bs = list(range(33, 127)) + list(range(161, 173)) + list(range(174, 256))
    cs, n = bs[:], 0
    for b in range(256):
        if b not in bs:
            bs.append(b); cs.append(256 + n); n += 1
    return {chr(c): b for b, c in zip(bs, cs)}


BYTE_DEC = _bytes_to_unicode()

if __name__ == "__main__":
    main(*sys.argv[1:3])
