import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVocab, MODELS, ORDER } from "../web/app/models.js";

test("ZIPA tokens.txt: blank is <blk>", () => {
  const { id2sym, blank } = parseVocab("<blk> 0\n<sos/eos> 1\na 4\n", "tokens");
  assert.equal(blank, 0);
  assert.equal(id2sym[4], "a");
});

test("MultIPA vocab.json carries its blank id", () => {
  const { id2sym, blank } = parseVocab(JSON.stringify({ blank: 310, vocab: { "[PAD]": 310, a: 231 } }), "json");
  assert.equal(blank, 310);
  assert.equal(id2sym[231], "a");
});

test("PhoneticXeus plain vocab defaults blank to 0", () => {
  assert.equal(parseVocab(JSON.stringify({ "<blank>": 0, a: 5 }), "json").blank, 0);
});

test("every model is in the vote order exactly once", () => {
  assert.deepEqual([...ORDER].sort(), MODELS.map(m => m.id).sort());
});

test("the five recommended models come first; every model has its paper and gold scores", () => {
  assert.deepEqual(MODELS.filter(m => m.recommended).map(m => m.id), ["phoneticxeus", "powsm", "zipa", "multipa", "whipa"]);
  assert.deepEqual(ORDER.slice(0, 5), ["phoneticxeus", "powsm", "zipa", "multipa", "whipa"]);
  for (const m of MODELS) {
    assert.ok(m.paper?.url && m.paper?.cite, m.id);
    assert.ok(m.gold?.per > 0 && m.gold?.pfer > 0, m.id);
    if (m.ready) assert.ok(m.url && m.mb, m.id);
  }
  // every model the paper benchmarked is offered (WhIPA large only as a note: too big)
  for (const id of ["wav2vec2phoneme", "allophant", "allosaurus", "zipa_large", "whipa_comb"])
    assert.ok(MODELS.some(m => m.id === id), id);
});
