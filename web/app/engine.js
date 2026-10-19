// Loading models (download once, keep in the browser cache) and running them.
// `ort` is the global from onnxruntime-web, loaded by index.html.
import { computeFbank, computeLogmel } from "./fbank.js";
import { greedyCtc } from "./ctc.js";
import { parseVocab } from "./models.js";
import { whisperLogmel, greedyDecode, segmentIpa } from "./whisper.js";

const CACHE = "ipa-models-v1";
let fbankCfg = null, logmelCfg = null, whisperCfg = null;

async function cached(url) {
  try { return await (await caches.open(CACHE)).match(url); } catch { return null; }
}

/** Download `url` (or read it from the cache), reporting progress 0..1. */
async function fetchBytes(url, onProgress) {
  const hit = await cached(url);
  if (hit) { onProgress?.(1); return { bytes: new Uint8Array(await hit.arrayBuffer()), fromCache: true }; }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download falhou (${res.status})`);
  const total = +res.headers.get("content-length") || 0, reader = res.body.getReader(), parts = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); got += value.length;
    if (total) onProgress?.(got / total);
  }
  const bytes = new Uint8Array(got);
  let off = 0;
  for (const p of parts) { bytes.set(p, off); off += p.length; }
  let stored = true;
  try {
    await navigator.storage?.persist?.();      // ask for durable storage so large models are kept
    await (await caches.open(CACHE)).put(url, new Response(bytes));
  } catch { stored = false; }
  return { bytes, fromCache: false, stored };
}

/** Is the model file already in the browser cache? */
export async function isCached(model) {
  return model.url ? !!(await cached(model.url)) && (!model.decoderUrl || !!(await cached(model.decoderUrl))) : false;
}

/** Delete one model from the browser cache. */
export async function forget(model) {
  try {
    const c = await caches.open(CACHE);
    await c.delete(model.url);
    if (model.decoderUrl) await c.delete(model.decoderUrl);
  } catch { /* nothing cached */ }
}

export async function load(model, backend, onProgress) {
  if (model.input === "fbank" && !fbankCfg) fbankCfg = await (await fetch("fbank80.json")).json();
  if (model.input === "logmel" && !logmelCfg) logmelCfg = await (await fetch("powsm_frontend.json")).json();
  const [{ bytes, fromCache, stored }, vocabText] = await Promise.all([
    fetchBytes(model.url, onProgress),
    fetch(model.vocab.url).then(r => r.text()),
  ]);
  const session = await ort.InferenceSession.create(bytes, { executionProviders: [backend] });
  const loaded = { session, ...parseVocab(vocabText, model.vocab.format), fromCache, stored };
  if (model.input === "whisper") {
    if (!whisperCfg) whisperCfg = await (await fetch("whisper_mel.json")).json();
    const dec = await fetchBytes(model.decoderUrl);
    loaded.decoder = await ort.InferenceSession.create(dec.bytes, { executionProviders: [backend] });
    loaded.stored = loaded.stored !== false && dec.stored !== false;
    const release = session.release.bind(session);
    loaded.session = { release: async () => { await release(); await loaded.decoder.release(); } };
    loaded.encoder = session;
  }
  return loaded;
}

/** Transcribe 16 kHz mono audio; phones carry start/end in seconds. */
export async function transcribe(model, loaded, wav) {
  if (model.input === "whisper") {
    const feats = whisperLogmel(wav, whisperCfg);
    const { hidden } = await loaded.encoder.run({ input_features: new ort.Tensor("float32", feats, [1, 80, 3000]) });
    const cap = Math.max(Math.round(wav.length / 16000), 1) * 20 + 4;      // 20 phones per second
    return segmentIpa(await greedyDecode(loaded.decoder, hidden, loaded.whisper, cap)).map(sym => ({ sym }));
  }
  let feeds, outName;
  if (model.input === "fbank") {
    const { data, frames } = computeFbank(wav, fbankCfg);
    feeds = {
      x: new ort.Tensor("float32", data, [1, frames, 80]),
      x_lens: new ort.Tensor("int64", BigInt64Array.from([BigInt(frames)]), [1]),
    };
    outName = "log_probs";
  } else if (model.input === "logmel") {
    const { data, frames } = computeLogmel(wav, logmelCfg);
    feeds = {
      feats: new ort.Tensor("float32", data, [1, frames, 80]),
      feats_lens: new ort.Tensor("int64", BigInt64Array.from([BigInt(frames)]), [1]),
    };
    outName = "logits";
  } else {
    feeds = { wav: new ort.Tensor("float32", wav, [1, wav.length]) };
    outName = "logits";
  }
  const out = (await loaded.session.run(feeds))[outName];
  const [, frames, vocabSize] = out.dims;
  const secPerFrame = wav.length / 16000 / frames;
  return greedyCtc(out.data, frames, vocabSize, loaded.id2sym, loaded.blank)
    .map(p => ({ sym: p.sym, start: p.start * secPerFrame, end: p.end * secPerFrame }));
}
