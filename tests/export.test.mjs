import { test } from "node:test";
import assert from "node:assert/strict";
import { zip, wavBytes, textGrid, bundle } from "../web/app/export.js";

const rec = {
  id: "x", created: Date.UTC(2026, 9, 19, 20, 0), label: "teste",
  wav: new Float32Array(16000),                       // 1 s of silence
  results: {
    phoneticxeus: [{ sym: "p", start: 0.1, end: 0.2 }, { sym: "a", start: 0.3, end: 0.5 }],
    zipa: [{ sym: "b", start: 0.1, end: 0.2 }, { sym: "a", start: 0.3, end: 0.5 }],
    multipa: [{ sym: "p", start: 0.1, end: 0.2 }, { sym: "a", start: 0.3, end: 0.5 }],
  },
};

test("WAV is 16-bit mono 16 kHz with the right size", () => {
  const b = wavBytes(rec.wav);
  const v = new DataView(b.buffer);
  assert.equal(new TextDecoder().decode(b.slice(0, 4)), "RIFF");
  assert.equal(v.getUint16(22, true), 1);             // channels
  assert.equal(v.getUint32(24, true), 16000);         // rate
  assert.equal(v.getUint16(34, true), 16);            // bits
  assert.equal(b.length, 44 + 32000);
});

test("zip is a valid stored archive (local headers + central directory)", () => {
  const z = zip([{ name: "a.txt", data: new TextEncoder().encode("oi") }, { name: "b.txt", data: new Uint8Array([1, 2, 3]) }]);
  const v = new DataView(z.buffer);
  assert.equal(v.getUint32(0, true), 0x04034b50);
  const eocd = z.length - 22;
  assert.equal(v.getUint32(eocd, true), 0x06054b50);
  assert.equal(v.getUint16(eocd + 10, true), 2);      // entries
  // CRC-32 of "oi" = 0x4F6D1E45? check against a known value instead:
  assert.equal(v.getUint32(14, true), crcRef("oi"));
});

function crcRef(s) {
  let c, crc = 0xffffffff;
  for (const byte of new TextEncoder().encode(s)) {
    c = (crc ^ byte) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

test("TextGrid has one interval tier per model plus consensus, gaps filled", () => {
  const tg = textGrid(rec, ["phoneticxeus", "zipa", "multipa"], [{ sym: "p", start: 0.1, end: 0.2, agreed: true }, { sym: "a", start: 0.3, end: 0.5, agreed: true }]);
  assert.match(tg, /size = 4/);
  assert.match(tg, /name = "consenso"/);
  assert.match(tg, /name = "zipa"/);
  assert.match(tg, /text = "b"/);
  // phoneticxeus tier: gap 0–0.1, p, gap, a, gap to 1.0 = 5 intervals
  const tier = tg.split("item [")[2];
  assert.match(tier, /intervals: size = 5/);
  assert.match(tier, /xmax = 1/);
});

test("bundle lists audio, text, json and TextGrid", () => {
  const files = bundle(rec, ["phoneticxeus", "zipa", "multipa"]);
  assert.deepEqual(files.map(f => f.name.split(".").pop()).sort(), ["TextGrid", "json", "txt", "wav"]);
  const txt = new TextDecoder().decode(files.find(f => f.name.endsWith(".txt")).data);
  assert.match(txt, /Consenso: pa/);
  assert.match(txt, /ZIPA: ba/);
});
