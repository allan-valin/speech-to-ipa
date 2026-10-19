// Reading recordings back: our export zips (stored, or re-packed with deflate by
// another tool), or the loose files of an unzipped export folder.

const dec = new TextDecoder();

async function inflate(bytes) {
  const out = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(out).arrayBuffer());
}

/** Entries of a zip as [{name, data}], folders and macOS metadata skipped. */
export async function readZip(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = bytes.length - 22;
  while (eocd >= 0 && v.getUint32(eocd, true) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("não é um arquivo zip");
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const files = [];
  for (let k = 0; k < count; k++) {
    const method = v.getUint16(p + 10, true), size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true), extraLen = v.getUint16(p + 30, true), commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = dec.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith("/") || name.startsWith("__MACOSX/")) continue;
    const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + size);
    if (method === 0) files.push({ name, data: raw.slice() });
    else if (method === 8) files.push({ name, data: await inflate(raw) });
    else throw new Error(`zip com compressão não suportada (${method})`);
  }
  return files;
}

/** 16-bit PCM WAV → { rate, samples } (first channel). */
export function parseWav(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let p = 12, rate = 0, channels = 1, bits = 0;
  while (p + 8 <= bytes.length) {
    const id = dec.decode(bytes.subarray(p, p + 4)), size = v.getUint32(p + 4, true);
    if (id === "fmt ") { channels = v.getUint16(p + 10, true); rate = v.getUint32(p + 12, true); bits = v.getUint16(p + 22, true); }
    if (id === "data") {
      if (bits !== 16) throw new Error(`WAV de ${bits} bits não suportado`);
      const n = Math.floor(size / 2 / channels), samples = new Float32Array(n);
      for (let i = 0; i < n; i++) samples[i] = v.getInt16(p + 8 + i * 2 * channels, true) / 0x7fff;
      return { rate, samples };
    }
    p += 8 + size + (size & 1);
  }
  throw new Error("WAV sem dados");
}

function to16k({ rate, samples }) {
  if (rate === 16000) return samples;
  const n = Math.round(samples.length * 16000 / rate), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i * rate / 16000, k = Math.floor(t), f = t - k;
    out[i] = (samples[k] ?? 0) * (1 - f) + (samples[k + 1] ?? samples[k] ?? 0) * f;
  }
  return out;
}

/**
 * Recordings from a list of files (zips are opened). Files are grouped by name
 * without extension: a .wav alone becomes a recording without transcriptions;
 * with its .json, the models' results come back too.
 */
export async function recordingsFrom(files) {
  const flat = [];
  for (const f of files) {
    if (/\.zip$/i.test(f.name)) flat.push(...await readZip(f.data));
    else flat.push(f);
  }
  const groups = new Map();
  for (const f of flat) {
    const base = f.name.split("/").pop(), m = base.match(/^(.*)\.([^.]+)$/);
    if (!m) continue;
    const g = groups.get(m[1]) || {};
    g[m[2].toLowerCase()] = f.data;
    groups.set(m[1], g);
  }
  const recs = [];
  for (const [stem, g] of groups) {
    if (!g.wav) continue;
    const json = g.json ? JSON.parse(dec.decode(g.json)) : null;
    recs.push({
      id: globalThis.crypto.randomUUID(),
      created: json ? Date.parse(json.created) : Date.now(),
      label: json?.label || stem,
      wav: to16k(parseWav(g.wav)),
      results: json?.results || {},
      ...(json?.edited ? { edited: json.edited } : {}),
    });
  }
  return recs;
}
