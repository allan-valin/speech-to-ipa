// The five voters. `ready: false` = not exported for the browser yet (M0 open item).
// Every ONNX file here takes 16 kHz mono audio: either the raw waveform ("wave")
// or ZIPA's 80-band filterbank ("fbank"), and returns per-frame CTC scores.

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
    id: "powsm", name: "POWSM", ready: false, mb: 350,
    credit: "Li et al. 2025", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: `${HF}/espnet/powsm`,
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
    id: "whipa", name: "WhIPA", ready: false, mb: 75,
    credit: "Suchardt et al. 2025", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/jshrdt/whipa-base-cv`,
  },
];

// Vote order: best model first (it is the backbone when no majority forms).
export const ORDER = ["phoneticxeus", "powsm", "zipa", "multipa", "whipa"];

/** Parse a vocabulary file into { id2sym, blank }. */
export function parseVocab(text, format) {
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
