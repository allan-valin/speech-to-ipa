// The five recommended voters, then the paper's other models.
// gold = PER / PFER on all 5,416 VoxAngeles clips (Allan's paper; PhoneticXeus measured for this app).
// Every ONNX file here takes 16 kHz mono audio, as the raw waveform ("wave"),
// ZIPA's 80-band Kaldi filterbank ("fbank") or POWSM's normalised log-mel ("logmel"),
// and returns per-frame CTC scores.

const HF = "https://huggingface.co";

export const MODELS = [
  {
    id: "phoneticxeus", name: "PhoneticXeus", ready: true, mb: 582, input: "wave",
    recommended: true, gold: { per: 51.9, pfer: 14.1 },
    paper: { cite: "Bharadwaj, Li, Choi, Yeo, Chen, Watanabe, Mortensen. An Empirical Recipe for Universal Phone Recognition. Interspeech 2026", url: "https://arxiv.org/abs/2603.29042" },
    url: `${HF}/allan-valin/phoneticxeus-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/phoneticxeus-onnx/resolve/main/ipa_vocab.json`, format: "json" },
    credit: "Bharadwaj et al. 2026", license: "CC BY-NC-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: `${HF}/changelinglab/PhoneticXeus`, copy: `${HF}/allan-valin/phoneticxeus-onnx`,
  },
  {
    // encoder + CTC head only: no language prompt, no runaway decoding, better on gold
    id: "powsm", name: "POWSM", ready: true, mb: 214, input: "logmel",
    recommended: true, gold: { per: 55.5, pfer: 16.1 },
    paper: { cite: "Li, Chang, Bharadwaj, Yeo, Choi, Zhu, Mortensen, Watanabe. POWSM: A Phonetic Open Whisper-Style Speech Foundation Model. 2025", url: "https://arxiv.org/abs/2510.24992" },
    url: `${HF}/allan-valin/powsm-ctc-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/powsm-ctc-onnx/resolve/main/vocab.json`, format: "json" },
    credit: "Li et al. 2025", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: `${HF}/espnet/powsm`, copy: `${HF}/allan-valin/powsm-ctc-onnx`,
  },
  {
    id: "zipa", name: "ZIPA", ready: true, mb: 71, input: "fbank",
    recommended: true, gold: { per: 64.2, pfer: 18.0 },
    paper: { cite: "Zhu, Samir, Chodroff, Mortensen. ZIPA: A family of efficient models for multilingual phone recognition. ACL 2025", url: "https://aclanthology.org/2025.acl-long.961/" },
    url: `${HF}/anyspeech/zipa-small-crctc-ns-700k/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/anyspeech/zipa-small-crctc-ns-700k/resolve/main/tokens.txt`, format: "tokens" },
    credit: "Zhu et al. 2025", license: "CC BY-NC-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: `${HF}/anyspeech/zipa-small-crctc-ns-700k`,
  },
  {
    id: "multipa", name: "MultIPA", ready: true, mb: 318, input: "wave",
    recommended: true, gold: { per: 62.4, pfer: 15.0 },
    paper: { cite: "Taguchi, Sakai, Haghani, Chiang. Universal Automatic Phonetic Transcription into the International Phonetic Alphabet. Interspeech 2023", url: "https://arxiv.org/abs/2308.03917" },
    url: `${HF}/allan-valin/multipa-onnx/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/allan-valin/multipa-onnx/resolve/main/vocab.json`, format: "json" },
    credit: "Taguchi et al. 2023", license: "MIT", licenseUrl: "https://github.com/ctaguchi/multipa",
    source: `${HF}/ctaguchi/wav2vec2-large-xlsr-japlmthufielta-ipa1000-ns`, copy: `${HF}/allan-valin/multipa-onnx`,
  },
  {
    // Whisper encoder + decoder, decoded greedily: whole strings, so no per-phone timing
    id: "whipa", name: "WhIPA", ready: true, mb: 146, input: "whisper",   // fp16: int8 shifted its output
    recommended: true, gold: { per: 83.7, pfer: 27.1 },
    paper: { cite: "Suchardt, El-Shazli, Cassotti. Towards Language-Agnostic STIPA: Universal Phonetic Transcription to Support Language Documentation at Scale. EMNLP 2025", url: "https://aclanthology.org/2025.emnlp-main.1600/" },
    url: `${HF}/allan-valin/whipa-base-onnx/resolve/main/encoder.fp16.onnx`,
    decoderUrl: `${HF}/allan-valin/whipa-base-onnx/resolve/main/decoder.fp16.onnx`,
    vocab: { url: `${HF}/allan-valin/whipa-base-onnx/resolve/main/tokens.json`, format: "whisper" },
    credit: "Suchardt et al. 2025", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/jshrdt/whipa-base-cv`, copy: `${HF}/allan-valin/whipa-base-onnx`,
  },
  // From the same paper, not converted for the browser yet: listed with their scores.
  {
    id: "wav2vec2phoneme", name: "Wav2Vec2Phoneme", ready: false, mb: 320, gold: { per: 53.0, pfer: 15.4 },
    credit: "Xu et al. 2021", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/facebook/wav2vec2-xlsr-53-espeak-cv-ft`,
    paper: { cite: "Xu, Baevski, Auli. Simple and Effective Zero-shot Cross-lingual Phoneme Recognition. Interspeech 2022", url: "https://arxiv.org/abs/2109.11680" },
  },
  {
    id: "whipa_comb", name: "LoWhIPA comb", ready: false, mb: 146, gold: { per: 77.8, pfer: 19.3 },
    credit: "Suchardt et al. 2025", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/jshrdt/lowhipa-base-comb`,
    paper: { cite: "Suchardt, El-Shazli, Cassotti. Towards Language-Agnostic STIPA. EMNLP 2025", url: "https://aclanthology.org/2025.emnlp-main.1600/" },
  },
  {
    id: "allophant", name: "Allophant", ready: false, mb: 320, gold: { per: 71.0, pfer: 20.5 },
    credit: "Glocker et al. 2023", license: "Apache 2.0", licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    source: `${HF}/kgnlp/allophant`,
    paper: { cite: "Glocker, Herygers, Georges. Allophant: Cross-lingual Phoneme Recognition with Articulatory Attributes. Interspeech 2023", url: "https://arxiv.org/abs/2306.04306" },
  },
  {
    id: "zipa_large", name: "ZIPA large", ready: true, mb: 310, input: "fbank", gold: { per: 69.1, pfer: 20.3 },
    url: `${HF}/anyspeech/zipa-large-crctc-ns-800k/resolve/main/model.int8.onnx`,
    vocab: { url: `${HF}/anyspeech/zipa-large-crctc-ns-800k/resolve/main/tokens.txt`, format: "tokens" },
    credit: "Zhu et al. 2025", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: `${HF}/anyspeech/zipa-large-crctc-ns-800k`,
    paper: { cite: "Zhu, Samir, Chodroff, Mortensen. ZIPA. ACL 2025", url: "https://aclanthology.org/2025.acl-long.961/" },
  },
  {
    id: "allosaurus", name: "Allosaurus", ready: false, mb: 15, gold: { per: 91.7, pfer: 32.7 },
    credit: "Li et al. 2020", license: "GPL 3.0", licenseUrl: "https://github.com/xinjli/allosaurus/blob/master/LICENSE",
    source: "https://github.com/xinjli/allosaurus",
    paper: { cite: "Li, Dalmia, Li, Lee, Littell, Yao, Anastasopoulos, Mortensen, Neubig, Black, Metze. Universal Phone Recognition with a Multilingual Allophone System. ICASSP 2020", url: "https://arxiv.org/abs/2002.11800" },
  },
];

// Vote order: best model first (it is the backbone when no majority forms).
export const ORDER = ["phoneticxeus", "powsm", "zipa", "multipa", "whipa",
  "wav2vec2phoneme", "whipa_comb", "allophant", "zipa_large", "allosaurus"];

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
