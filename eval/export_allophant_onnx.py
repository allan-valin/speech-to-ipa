"""Export Allophant (XLS-R + articulatory attribute composition, CTC) to ONNX int8.

    HF_HOME=... python eval/export_allophant_onnx.py <outdir> [universal|paper]

Allophant scores phonemes by composing their articulatory attributes, so it can
decode against any inventory. The inventory is baked into the graph:
  universal: every phoneme of every language in its Allophoible database (the app
             has no language setting);
  paper:     the 16-language union used in Allan's benchmark run.
Output: wav [1, samples] float32 -> log_probs [1, frames, 1 + inventory] (blank = 0),
plus vocab.json in the app's format.
"""
import json
import os
import sys

import torch


PAPER_LANGS = ["en", "es", "tr", "cmn", "ar", "hi", "ru", "de", "fr", "ja", "ko", "vi", "fi", "sw", "yue", "th"]


def inventory(indexer, which):
    if which == "paper":
        return indexer.phoneme_inventory(PAPER_LANGS)
    return indexer._allophone_data.inventories.index.unique().to_list()


class LogProbs(torch.nn.Module):
    def __init__(self, estimator, feature_matrix, layer):
        super().__init__()
        self.estimator, self.layer = estimator, layer
        self.register_buffer("feature_matrix", feature_matrix)

    def forward(self, wav):                       # (1, samples)
        from allophant.dataset_processing import Batch
        lengths = torch.ones_like(wav[0]).sum().long().unsqueeze(0)    # traced from the shape, stays dynamic
        out = self.estimator.model(Batch(wav, lengths, torch.zeros(1, dtype=torch.long)), self.feature_matrix, predict=True)
        return self.estimator.model.log_probabilities(out.outputs[self.layer]).transpose(0, 1)


def main(outdir, which="universal"):
    from allophant.estimator import Estimator
    from allophant.config import ProjectionEntryConfig
    os.makedirs(outdir, exist_ok=True)
    estimator, indexer = Estimator.restore("kgnlp/allophant", device="cpu")
    estimator.model.eval()
    inv = inventory(indexer, which)
    layer = ProjectionEntryConfig.PHONEME_LAYER
    sub = indexer.attributes.subset(inv)
    phones = list(sub.feature_values(layer, torch.arange(len(inv))))
    fm = indexer.composition_feature_matrix(inv)
    model = LogProbs(estimator, fm, layer).eval()
    with torch.no_grad():
        probe = model(torch.randn(1, 32000))
    print("inventory", which, len(inv), "output", tuple(probe.shape))
    fp32 = os.path.join(outdir, "model.onnx")
    torch.onnx.export(model, (torch.randn(1, 32000),), fp32, input_names=["wav"], output_names=["logits"],
                      dynamic_axes={"wav": {1: "samples"}, "logits": {1: "frames"}}, opset_version=17, dynamo=False)
    from onnxruntime.quantization import QuantType, quantize_dynamic
    # MatMul only, per channel: the setting that kept Wav2Vec2Phoneme within 0.3 PER of fp32
    quantize_dynamic(fp32, os.path.join(outdir, "model.int8.onnx"), weight_type=QuantType.QInt8,
                     per_channel=True, op_types_to_quantize=["MatMul"])
    with open(os.path.join(outdir, "vocab.json"), "w", encoding="utf-8") as f:
        json.dump({"blank": 0, "vocab": {"<blank>": 0, **{p: i + 1 for i, p in enumerate(phones)}}}, f, ensure_ascii=False)


if __name__ == "__main__":
    main(*sys.argv[1:3])
