import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { whisperLogmel, decodeTokens } from "../web/app/whisper.js";

const cfg = JSON.parse(readFileSync(new URL("../web/app/whisper_mel.json", import.meta.url)));

for (const clip of ["uralic_hun_016", "sinotibetan_mya_001", "abkhazadyge_abk_001"]) {
  test(`Whisper log-mel matches HF on ${clip}`, () => {
    const fx = JSON.parse(readFileSync(new URL(`fixtures/whisper_${clip}.json`, import.meta.url)));
    const data = whisperLogmel(Float32Array.from(fx.wav), cfg);    // [80 * 3000], row-major (mel, frame)
    assert.equal(data.length, 80 * 3000);
    let worst = 0;
    for (let k = 0; k < 80; k++)
      for (let t = 0; t < 120; t++) worst = Math.max(worst, Math.abs(data[k * 3000 + t] - fx.feats[k][t]));
    assert.ok(worst < 1e-3, `max abs diff ${worst}`);
  });
}

test("byte-level BPE tokens decode to UTF-8 IPA", () => {
  // GPT-2 byte mapping: "ʃ" = bytes CA 83 -> "Ê" + "ĥ"
  assert.equal(decodeTokens(["a", "Ê", "ĥ", "Ġb"]), "aʃ b");
});

import { segmentIpa } from "../web/app/whisper.js";
test("IPA strings split into phones: diacritics, length and tie bars stay attached", () => {
  assert.deepEqual(segmentIpa("t͡ʃaː"), ["t͡ʃ", "aː"]);
  assert.deepEqual(segmentIpa("aʃ b"), ["a", "ʃ", "b"]);
  assert.deepEqual(segmentIpa("kʰt̪ʲ"), ["kʰ", "t̪ʲ"]);
  assert.deepEqual(segmentIpa(""), []);
});
