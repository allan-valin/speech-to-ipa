// The five voters, in the order they were ranked on gold.
// Every ONNX file here takes 16 kHz mono audio, as the raw waveform ("wave"),
// ZIPA's 80-band Kaldi filterbank ("fbank") or POWSM's normalised log-mel ("logmel"),
// and returns per-frame CTC scores.

const HF = "https://huggingface.co";

export const MODELS = [
  {
    id: "phoneticxeus", name: "PhoneticXeus", ready: true, mb: 582, input: "wave",
    url: `${HF}/allan-valin/phoneticxeus-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/phoneticxeus-onnx/resolve/main/ipa_vocab.json`, format: "json" },
    credit: "Bharadwaj et al. 2026", license: "CC BY-NC-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: `${HF}/changelinglab/PhoneticXeus`, copy: `${HF}/allan-valin/phoneticxeus-onnx`,
  },
  {
    // encoder + CTC head only: no language prompt, no runaway decoding, better on gold
    id: "powsm", name: "POWSM", ready: true, mb: 214, input: "logmel",
    url: `${HF}/allan-valin/powsm-ctc-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/powsm-ctc-onnx/resolve/main/vocab.json`, format: "json" },
    credit: "Li et al. 2025", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: `${HF}/espnet/powsm`, copy: `${HF}/allan-valin/powsm-ctc-onnx`,
  },
  {
    id: "zipa", name: "ZIPA", ready: true, mb: 71, input: "fbank",
    url: `${HF}/anyspeech/zipa-small-crctc-ns-700k/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/anyspeech/zipa-small-crctc-ns-700k/resolve/main/tokens.txt`, format: "tokens" },
    credit: "Zhu et al. 2025", license: "CC BY-NC-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: `${HF}/anyspeech/zipa-small-crctc-ns-700k`,
  },
  {
    id: "multipa", name: "MultIPA", ready: true, mb: 318, input: "wave",
    url: `${HF}/allan-valin/multipa-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/multipa-onnx/resolve/main/vocab.json`, format: "json" },
    credit: "Taguchi et al. 2023", license: "MIT", licenseUrl: "https://github.com/ctaguchi/multipa",
    source: `${HF}/ctaguchi/wav2vec2-large-xlsr-japlmthufielta-ipa1000-ns`, copy: `${HF}/allan-valin/multipa-onnx`,
  },
  {
    // Whisper encoder + decoder, decoded greedily: whole strings, so no per-phone timing
    id: "whipa", name: "WhIPA", ready: true, mb: 146, input: "whisper",   // fp16: int8 shifted its output
    url: `${HF}/allan-valin/whipa-base-onnx/resolve/main/encoder.fp16.onnx`,
    decoderUrl: `${HF}/allan-valin/whipa-base-onnx/resolve/main/decoder.fp16.onnx`,
    vocab: { url: `${HF}/allan-valin/whipa-base-onnx/resolve/main/tokens.json`, format: "whisper" },
    credit: "Suchardt et al. 2025", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/jshrdt/whipa-base-cv`, copy: `${HF}/allan-valin/whipa-base-onnx`,
  },
];

// Vote order: best model first (it is the backbone when no majority forms).
export const ORDER = ["phoneticxeus", "powsm", "zipa", "multipa", "whipa"];

/** Parse a vocabulary file into { id2sym, blank }. */
export function parseVocab(text, format) {
  if (format === "whisper") return { whisper: JSON.parse(text) };   // prompt, eos, token strings
  if (format === "tokens") {                         // "<sym> <id>" per line (ZIPA)
    const id2sym = [];
    for (const line of text.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) id2sym[+parts[1]] = parts[0];
    }
    return { id2sym, blank: id2sym.indexOf("<blk>") };
  }
  const json = JSON.parse(text);
  const vocab = json.vocab || json;                  // MultIPA wraps it with its blank id
  const id2sym = [];
  for (const [sym, id] of Object.entries(vocab)) id2sym[id] = sym;
  return { id2sym, blank: json.blank ?? 0 };
}
