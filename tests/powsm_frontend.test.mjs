import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { computeLogmel } from "../web/app/fbank.js";

const cfg = JSON.parse(readFileSync(new URL("../web/app/powsm_frontend.json", import.meta.url)));

for (const clip of ["uralic_hun_016", "sinotibetan_mya_001", "abkhazadyge_abk_001"]) {
  test(`POWSM features match ESPnet on ${clip}`, () => {
    const fx = JSON.parse(readFileSync(new URL(`fixtures/powsm_${clip}.json`, import.meta.url)));
    const { data, frames } = computeLogmel(Float32Array.from(fx.wav), cfg);
    assert.equal(frames, fx.feats.length);
    let worst = 0;
    for (let t = 0; t < frames; t++)
      for (let k = 0; k < 80; k++) worst = Math.max(worst, Math.abs(data[t * 80 + k] - fx.feats[t][k]));
    assert.ok(worst < 1e-3, `max abs diff ${worst}`);
  });
}
