"""Export PhoneticXeus (raw 16 kHz waveform -> CTC logits) to ONNX, fp32 + int8.

    HF_HOME=... python eval/export_pxeus_onnx.py <outdir>

Writes model.onnx, model.int8.onnx and tokens.txt (id -> symbol) to <outdir>.
"""
import os
import sys

import torch
from transformers import AutoModel


class Logits(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model

    def forward(self, wav):                     # (1, samples) float32
        # The frontend's F.layer_norm(x, x.shape) cannot be traced with a dynamic
        # length, so the same whole-utterance normalisation is done here instead.
        mean = wav.mean(dim=1, keepdim=True)
        var = ((wav - mean) ** 2).mean(dim=1, keepdim=True)
        wav = (wav - mean) / torch.sqrt(var + 1e-5)
        return self.model(input_values=wav).logits


def main(outdir):
    os.makedirs(outdir, exist_ok=True)
    model = AutoModel.from_pretrained("changelinglab/PhoneticXeus", trust_remote_code=True).eval()
    frontend = model.model.frontend
    assert frontend.normalize_audio, "export assumes the frontend normalises audio"
    frontend.normalize_audio = False            # done in Logits.forward instead
    fp32 = os.path.join(outdir, "model.onnx")
    torch.onnx.export(Logits(model), (torch.randn(1, 32000),), fp32,
                      input_names=["wav"], output_names=["logits"],
                      dynamic_axes={"wav": {1: "samples"}, "logits": {1: "frames"}},
                      opset_version=17, dynamo=False)
    from onnxruntime.quantization import QuantType, quantize_dynamic
    quantize_dynamic(fp32, os.path.join(outdir, "model.int8.onnx"), weight_type=QuantType.QInt8)
    import shutil
    from huggingface_hub import snapshot_download
    repo = snapshot_download("changelinglab/PhoneticXeus")
    shutil.copy(os.path.join(repo, model.config.vocab_file), os.path.join(outdir, "ipa_vocab.json"))
    print("wrote", os.listdir(outdir))


if __name__ == "__main__":
    main(sys.argv[1])
