// WhIPA (Whisper base fine-tuned for IPA): log-mel front end, byte-level token
// decoding and the greedy decode loop. Constants come from whisper_mel.json and the
// model's tokens.json, both written by eval/export_whipa_onnx.py.

let dft = null;          // cos/sin tables for the 400-point DFT, built once

/**
 * Whisper's features: audio zero-padded to 30 s, centred STFT (400-point periodic
 * Hann, hop 160, reflect padding), power, 80 mel filters, log10, floor at max − 8,
 * then (x + 4) / 4. Returns Float32Array [80 * 3000] in (mel, frame) order.
 * Frames past the audio are pure padding, so they are filled without computing them.
 */
export function whisperLogmel(wav, cfg) {
  const { filters, fft: N, shift, samples } = cfg;          // filters: [80][201]
  const bins = N / 2 + 1, frames = samples / shift, half = N / 2;
  const n = Math.min(wav.length, samples);
  if (!dft) {
    dft = { cos: new Float64Array(bins * N), sin: new Float64Array(bins * N), win: new Float64Array(N) };
    for (let i = 0; i < N; i++) dft.win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
    for (let k = 0; k < bins; k++)
      for (let i = 0; i < N; i++) {
        dft.cos[k * N + i] = Math.cos((2 * Math.PI * k * i) / N);
        dft.sin[k * N + i] = Math.sin((2 * Math.PI * k * i) / N);
      }
  }
  // sample i of the zero-padded 30 s signal, reflect-padded at both ends
  const total = samples;
  const raw = i => (i < n ? wav[i] : 0);
  const at = i => (i < 0 ? raw(-i) : i >= total ? raw(2 * (total - 1) - i) : raw(i));
  const out = new Float32Array(80 * frames);
  const frame = new Float64Array(N), power = new Float64Array(bins);
  let silent = null, max = -Infinity;
  for (let t = 0; t < frames; t++) {
    const start = t * shift - half;
    const empty = start >= n && start + N <= total;          // only zero padding in this window
    if (empty && silent !== null) {
      for (let k = 0; k < 80; k++) out[k * frames + t] = silent;
      continue;
    }
    for (let i = 0; i < N; i++) frame[i] = at(start + i) * dft.win[i];
    for (let k = 0; k < bins; k++) {
      let re = 0, im = 0;
      const c = k * N;
      for (let i = 0; i < N; i++) { re += frame[i] * dft.cos[c + i]; im -= frame[i] * dft.sin[c + i]; }
      power[k] = re * re + im * im;
    }
    for (let k = 0; k < 80; k++) {
      const f = filters[k];
      let e = 0;
      for (let j = 0; j < bins; j++) e += f[j] * power[j];
      const x = Math.log10(Math.max(e, 1e-10));
      out[k * frames + t] = x;
      if (x > max) max = x;
    }
    if (empty) silent = out[t];                              // every mel band is log10(1e-10) here
  }
  if (silent !== null && silent > max) max = silent;
  for (let i = 0; i < out.length; i++) out[i] = (Math.max(out[i], max - 8) + 4) / 4;
  return out;
}

// GPT-2 byte <-> unicode table: each token character stands for one UTF-8 byte.
const BYTE = (() => {
  const bs = [];
  for (let b = 33; b < 127; b++) bs.push(b);
  for (let b = 161; b < 173; b++) bs.push(b);
  for (let b = 174; b < 256; b++) bs.push(b);
  const cs = [...bs];
  let n = 0;
  for (let b = 0; b < 256; b++) if (!bs.includes(b)) { bs.push(b); cs.push(256 + n++); }
  return Object.fromEntries(cs.map((c, i) => [String.fromCharCode(c), bs[i]]));
})();

export function decodeTokens(tokens) {
  const bytes = [];
  for (const t of tokens) for (const ch of t) bytes.push(BYTE[ch] ?? 63);
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/** Greedy decode: prompt, suppressed tokens, stop at <|endoftext|> or the length cap. */
export async function greedyDecode(decoder, hidden, meta, cap) {
  const ids = [...meta.prompt];
  for (let step = 0; step < cap; step++) {
    const L = ids.length;
    const out = await decoder.run({
      input_ids: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, L]),
      positions: new ort.Tensor("int64", BigInt64Array.from({ length: L }, (_, i) => BigInt(i)), [L]),
      hidden,
    });
    const V = out.logits.dims[2], last = out.logits.data.subarray((L - 1) * V, L * V);
    const banned = new Set(step === 0 ? [...meta.suppress, ...meta.beginSuppress] : meta.suppress);
    let best = -Infinity, id = 0;
    for (let k = 0; k < V; k++) if (last[k] > best && !banned.has(k)) { best = last[k]; id = k; }
    if (id === meta.eos) break;
    ids.push(id);
  }
  const text = ids.slice(meta.prompt.length).filter(i => i < meta.firstSpecial).map(i => meta.tokens[i]);
  return decodeTokens(text).trim();
}

/** Split an IPA string into phones: a base letter plus following diacritics,
 *  modifier letters and length marks; a tie bar (U+0361 / U+035C) joins the next letter. */
export function segmentIpa(text) {
  const phones = [];
  let joinNext = false;
  for (const ch of text.replace(/\s+/g, "")) {
    const mod = /[\p{Mn}\p{Lm}\p{Sk}]/u.test(ch);
    if (phones.length && (mod || joinNext)) {
      phones[phones.length - 1] += ch;
      joinNext = ch === "͡" || ch === "͜";
    } else {
      phones.push(ch);
      joinNext = false;
    }
  }
  return phones;
}
