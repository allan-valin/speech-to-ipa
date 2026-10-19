// Export bundle: the recording (WAV), every model's IPA + the consensus (TXT),
// timings/votes/alternatives (JSON) and a Praat TextGrid, packed in a plain zip.
import { MODELS, ORDER } from "./models.js";
import { grid } from "./vote.js";

const NAMES = Object.fromEntries(MODELS.map(m => [m.id, m.name]));
const enc = new TextEncoder();

export function wavBytes(samples, rate = 16000) {
  const out = new Uint8Array(44 + samples.length * 2), v = new DataView(out.buffer);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE");
  str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, samples.length * 2, true);
  samples.forEach((x, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, x)) * 0x7fff, true));
  return out;
}

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Uncompressed ("stored") zip of [{name, data: Uint8Array}], entries dated `when`. */
export function zip(files, when = new Date()) {
  const dosTime = (when.getHours() << 11) | (when.getMinutes() << 5) | (when.getSeconds() >> 1);
  const dosDate = ((when.getFullYear() - 1980) << 9) | ((when.getMonth() + 1) << 5) | when.getDate();
  const parts = [], central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name), crc = crc32(f.data);
    // Info-ZIP Unicode Path field (0x7075): some unzip builds ignore the UTF-8 flag but read this
    const extra = new Uint8Array(9 + name.length), xv = new DataView(extra.buffer);
    xv.setUint16(0, 0x7075, true); xv.setUint16(2, 5 + name.length, true); xv.setUint8(4, 1);
    xv.setUint32(5, crc32(name), true); extra.set(name, 9);
    const local = new Uint8Array(30 + name.length + extra.length), lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); // UTF-8 names
    lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, f.data.length, true); lv.setUint32(22, f.data.length, true);
    lv.setUint16(26, name.length, true); lv.setUint16(28, extra.length, true);
    local.set(name, 30); local.set(extra, 30 + name.length);
    const cen = new Uint8Array(46 + name.length + extra.length), cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, f.data.length, true); cv.setUint32(24, f.data.length, true);
    cv.setUint16(28, name.length, true); cv.setUint16(30, extra.length, true); cv.setUint32(42, offset, true);
    cen.set(name, 46); cen.set(extra, 46 + name.length);
    parts.push(local, f.data); central.push(cen);
    offset += local.length + f.data.length;
  }
  const cenSize = central.reduce((a, c) => a + c.length, 0);
  const end = new Uint8Array(22), ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
  ev.setUint32(12, cenSize, true); ev.setUint32(16, offset, true);
  const all = [...parts, ...central, end], out = new Uint8Array(all.reduce((a, p) => a + p.length, 0));
  let o = 0;
  for (const p of all) { out.set(p, o); o += p.length; }
  return out;
}

/** Praat TextGrid (long format): consensus tier first, then one tier per model. */
export function textGrid(rec, ran, cons) {
  const dur = rec.wav.length / 16000;
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const tier = (name, phones) => {
    const iv = [];
    let t = 0;
    for (const p of phones.filter(p => p.start !== undefined).sort((a, b) => a.start - b.start)) {
      const s = Math.max(p.start, t), e = Math.min(Math.max(p.end, s), dur);
      if (s > t) iv.push([t, s, ""]);
      if (e > s) { iv.push([s, e, p.sym]); t = e; }
    }
    if (t < dur) iv.push([t, dur, ""]);
    return `        class = "IntervalTier"\n        name = ${q(name)}\n        xmin = 0\n        xmax = ${dur}\n`
      + `        intervals: size = ${iv.length}\n`
      + iv.map(([s, e, x], i) => `        intervals [${i + 1}]:\n            xmin = ${s}\n            xmax = ${e}\n            text = ${q(x)}\n`).join("");
  };
  const tiers = [["consenso", cons], ...ran.map(id => [id, rec.results[id]])];
  return `File type = "ooTextFile"\nObject class = "TextGrid"\n\nxmin = 0\nxmax = ${dur}\ntiers? <exists>\nsize = ${tiers.length}\nitem []:\n`
    + tiers.map(([n, p], i) => `    item [${i + 1}]:\n${tier(n, p)}`).join("");
}

const two = n => String(n).padStart(2, "0");
const stamp = d => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}_${two(d.getHours())}-${two(d.getMinutes())}-${two(d.getSeconds())}`;

/**
 * File name: the date first (local time, like the list shows), then what it is, how long,
 * and the transcription (the edit if there is one). Characters that file systems
 * refuse become "-".
 */
export function baseName(rec, cons) {
  const ipa = (rec.edited || cons.map(c => c.sym)).join("").normalize("NFC")
    .replace(/[\\/:*?"<>|‖\s]+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
  const secs = `${(rec.wav.length / 16000).toFixed(1)}s`;
  return [stamp(new Date(rec.created)), "ipa", secs, [...ipa].slice(0, 40).join("")].filter(Boolean).join("_");
}

/** Every recording in one zip, each in its own folder. Returns { name, data }. */
export function zipAll(recs, when = new Date()) {
  const files = recs.flatMap(rec => bundle(rec, ORDER.filter(id => rec.results[id])));
  return { name: `${stamp(when)}_ipa_${recs.length}-recordings.zip`, data: zip(files, when) };
}

/** The consensus as shown on screen: columns aligned by time, empty decisions dropped. */
export function consensus(rec, ran) {
  return grid(Object.fromEntries(ran.map(id => [id, rec.results[id]])), ran).map(c => c.cons).filter(c => c.sym);
}

/** Files for one recording. `ran` = model ids in vote order that have results. */
export function bundle(rec, ran) {
  const cons = consensus(rec, ran);
  const base = baseName(rec, cons);
  const txt = [`Consenso: ${cons.map(s => s.sym).join("")}`,
    ...(rec.edited ? [`Editado: ${rec.edited.join("")}`] : []),
    `Sem maioria: ${cons.filter(s => !s.agreed).map(s => s.sym).join(" ") || "(nenhum)"}`,
    "", ...ran.map(id => `${NAMES[id]}: ${rec.results[id].map(p => p.sym).join("")}`)].join("\n") + "\n";
  const json = {
    created: new Date(rec.created).toISOString(), label: rec.label, seconds: rec.wav.length / 16000, models: ran,
    consensus: cons.map(({ sym, agreed, alternatives, start, end }) => ({ sym, agreed, alternatives, start, end })),
    results: Object.fromEntries(ran.map(id => [id, rec.results[id]])),
    ...(rec.edited ? { edited: rec.edited } : {}),
  };
  // inside a folder, so unzipping never mixes the files with others
  return [
    { name: `${base}/${base}.wav`, data: wavBytes(rec.wav) },
    { name: `${base}/${base}.txt`, data: enc.encode(txt) },
    { name: `${base}/${base}.json`, data: enc.encode(JSON.stringify(json, null, 2)) },
    { name: `${base}/${base}.TextGrid`, data: enc.encode(textGrid(rec, ran, cons)) },
  ];
}
