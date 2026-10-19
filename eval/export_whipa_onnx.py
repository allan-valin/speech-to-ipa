"""Export WhIPA (Whisper base fine-tuned for IPA) to two ONNX graphs (fp32, int8, fp16) + JS fixtures.

    HF_HOME=... python eval/export_whipa_onnx.py <workdir> <outdir>

encoder.onnx: input_features [1, 80, 3000] -> hidden [1, 1500, 512]
decoder.onnx: input_ids [1, L] int64 + positions [L] + hidden -> logits [1, L, vocab] (no KV cache;
              outputs are a few dozen tokens, so re-running the decoder is fine)
The browser decodes greedily with prompt <|startoftranscript|><|ip|><|transcribe|>
<|notimestamps|> and a cap of 20 phones per second, which scored better on gold
than the harness's beam search + fallbacks (docs/M0-RESULTS.md).
Also writes web/app/whisper_mel.json (mel filters) and tests/fixtures/whisper_*.json.
"""
import json
import os
import sys

import torch

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIPS = ["uralic_hun_016", "sinotibetan_mya_001", "abkhazadyge_abk_001"]


class Decoder(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.decoder, self.proj = model.model.decoder, model.proj_out

    def forward(self, input_ids, positions, hidden):
        # positions = arange(L), given as an input so the traced graph keeps L dynamic
        out = self.decoder(input_ids=input_ids, encoder_hidden_states=hidden, position_ids=positions[None],
                           cache_position=positions, use_cache=False)
        return self.proj(out.last_hidden_state)


def main(workdir, outdir):
    sys.path.insert(0, os.path.join(workdir, "corpora/whipa_repo/code"))
    sys.path.insert(0, os.path.join(workdir, "scripts"))
    from deploy import WHIPA
    from run_inference import _load_audio_mono16k
    os.makedirs(outdir, exist_ok=True)
    w = WHIPA(model_path=os.path.join(workdir, "models/whipa_base_cv"), base_model_name="openai/whisper-base", lora=False)
    model, tok, fe = w.model.eval(), w.tokenizer, w.processor.feature_extractor

    with open(os.path.join(HERE, "web/app/whisper_mel.json"), "w") as f:
        json.dump({"filters": fe.mel_filters.T.tolist(), "fft": fe.n_fft, "shift": fe.hop_length,
                   "samples": fe.n_samples}, f)
    for clip in CLIPS:
        wav = _load_audio_mono16k(os.path.join(workdir, "audio", clip + ".wav"))
        feats = fe(wav, sampling_rate=16000, return_tensors="np").input_features[0]
        with open(os.path.join(HERE, f"tests/fixtures/whisper_{clip}.json"), "w") as f:
            json.dump({"wav": wav.tolist(), "feats": feats[:, :120].tolist(), "max": float(feats.max())}, f)

    feats = torch.zeros(1, 80, 3000)
    torch.onnx.export(model.model.encoder, (feats,), os.path.join(outdir, "encoder.onnx"),
                      input_names=["input_features"], output_names=["hidden"], opset_version=17, dynamo=False)
    hidden = model.model.encoder(feats).last_hidden_state
    ids = torch.tensor([[50258, 51865, 50359, 50363]])
    L = torch.export.Dim("L", min=1, max=448)
    torch.onnx.export(Decoder(model), (ids, torch.arange(4), hidden), os.path.join(outdir, "decoder.onnx"),
                      input_names=["input_ids", "positions", "hidden"], output_names=["logits"],
                      dynamic_shapes={"input_ids": {1: L}, "positions": {0: L}, "hidden": None},
                      opset_version=18, dynamo=True, external_data=False)
    from onnxruntime.quantization import QuantType, quantize_dynamic
    for part in ("encoder", "decoder"):
        quantize_dynamic(os.path.join(outdir, f"{part}.onnx"), os.path.join(outdir, f"{part}.int8.onnx"),
                         weight_type=QuantType.QInt8)
    # Shipped as fp16 (int8 shifted the greedy output; fp16 matched fp32 on 94/95 clips)
    import onnx
    from onnxconverter_common import float16
    for part in ("encoder", "decoder"):
        m16 = float16.convert_float_to_float16(onnx.load(os.path.join(outdir, f"{part}.onnx")), keep_io_types=True)
        onnx.save(m16, os.path.join(outdir, f"{part}.fp16.onnx"))
    prompt = tok.convert_tokens_to_ids(["<|startoftranscript|>", "<|ip|>", "<|transcribe|>", "<|notimestamps|>"])
    vocab = tok.get_vocab()
    id2tok = [""] * (max(vocab.values()) + 1)
    for t, i in vocab.items():
        id2tok[i] = t
    with open(os.path.join(outdir, "tokens.json"), "w", encoding="utf-8") as f:
        json.dump({"prompt": prompt, "eos": tok.eos_token_id, "firstSpecial": 50257,
                   "suppress": model.generation_config.suppress_tokens or [],
                   "beginSuppress": model.generation_config.begin_suppress_tokens or [], "tokens": id2tok}, f,
                  ensure_ascii=False)
    print("prompt", prompt, "vocab", len(id2tok))


if __name__ == "__main__":
    main(*sys.argv[1:3])
