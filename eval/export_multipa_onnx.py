"""Export a wav2vec2 + CTC phone model (raw 16 kHz waveform -> logits) to ONNX int8.

    HF_HOME=... python eval/export_multipa_onnx.py <outdir> [checkpoint]

Default checkpoint: MultIPA. Also used for Wav2Vec2Phoneme
(facebook/wav2vec2-xlsr-53-espeak-cv-ft).

Like the PhoneticXeus export, the feature extractor's per-utterance normalisation
is moved into the graph, so the browser feeds the raw waveform to every model.
Writes model.onnx (+ external data), model.int8.onnx and vocab.json.
"""
import json
import os
import sys

import torch
from transformers import AutoModelForCTC, AutoProcessor

CHECKPOINT = "ctaguchi/wav2vec2-large-xlsr-japlmthufielta-ipa1000-ns"


class Logits(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model

    def forward(self, wav):                     # (1, samples) float32
        # Wav2Vec2FeatureExtractor with do_normalize=True: zero mean, unit variance.
        mean = wav.mean(dim=1, keepdim=True)
        var = ((wav - mean) ** 2).mean(dim=1, keepdim=True)
        wav = (wav - mean) / torch.sqrt(var + 1e-7)
        return self.model(input_values=wav).logits


def main(outdir, checkpoint=CHECKPOINT):
    os.makedirs(outdir, exist_ok=True)
    # do_phonemize=False: Wav2Vec2Phoneme's tokenizer would otherwise start an espeak
    # backend, needed only for text -> phonemes, never for decoding
    processor = AutoProcessor.from_pretrained(checkpoint, do_phonemize=False)
    assert processor.feature_extractor.do_normalize
    model = AutoModelForCTC.from_pretrained(checkpoint).eval()
    fp32 = os.path.join(outdir, "model.onnx")
    torch.onnx.export(Logits(model), (torch.randn(1, 32000),), fp32,
                      input_names=["wav"], output_names=["logits"],
                      dynamic_axes={"wav": {1: "samples"}, "logits": {1: "frames"}},
                      opset_version=17, dynamo=False)
    from onnxruntime.quantization import QuantType, quantize_dynamic
    quantize_dynamic(fp32, os.path.join(outdir, "model.int8.onnx"), weight_type=QuantType.QInt8)
    vocab = processor.tokenizer.get_vocab()
    with open(os.path.join(outdir, "vocab.json"), "w", encoding="utf-8") as f:
        json.dump({"blank": processor.tokenizer.pad_token_id, "vocab": vocab}, f, ensure_ascii=False)
    print("wrote", sorted(os.listdir(outdir))[:5])


if __name__ == "__main__":
    main(*sys.argv[1:3])
