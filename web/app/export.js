// Export bundle: the recording (WAV), every model's IPA + the consensus (TXT),
// timings/votes/alternatives (JSON) and a Praat TextGrid, packed in a plain zip.
import { MODELS } from "./models.js";
import { align, vote } from "./vote.js";

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
    const local = new Uint8Array(30 + name.length), lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); // UTF-8 names
    lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, f.data.length, true); lv.setUint32(22, f.data.length, true);
    lv.setUint16(26, name.length, true); local.set(name, 30);
    const cen = new Uint8Array(46 + name.length), cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, f.data.length, true); cv.setUint32(24, f.data.length, true);
    cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true); cen.set(name, 46);
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

/** Files for one recording. `ran` = model ids in vote order that have results. */
export function bundle(rec, ran) {
  const cons = vote(align(Object.fromEntries(ran.map(id => [id, rec.results[id]])), ran), ran, ran[0]);
  const d = new Date(rec.created), two = n => String(n).padStart(2, "0");   // local time, like the list shows
  const stamp = `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}${two(d.getSeconds())}`;
  const base = `ipa-${stamp}`;
  const txt = [`Consenso: ${cons.map(s => s.sym).join("")}`,
    `Sem maioria: ${cons.filter(s => !s.agreed).map(s => s.sym).join(" ") || "(nenhum)"}`,
    "", ...ran.map(id => `${NAMES[id]}: ${rec.results[id].map(p => p.sym).join("")}`)].join("\n") + "\n";
  const json = {
    created: new Date(rec.created).toISOString(), label: rec.label, seconds: rec.wav.length / 16000, models: ran,
    consensus: cons.map(({ sym, agreed, alternatives, start, end }) => ({ sym, agreed, alternatives, start, end })),
    results: Object.fromEntries(ran.map(id => [id, rec.results[id]])),
  };
  return [
    { name: `${base}.wav`, data: wavBytes(rec.wav) },
    { name: `${base}.txt`, data: enc.encode(txt) },
    { name: `${base}.json`, data: enc.encode(JSON.stringify(json, null, 2)) },
    { name: `${base}.TextGrid`, data: enc.encode(textGrid(rec, ran, cons)) },
  ];
}
