import { test } from "node:test";
import assert from "node:assert/strict";
import { greedyCtc } from "../web/app/ctc.js";
import { align, vote } from "../web/app/vote.js";

test("greedy CTC merges repeats, drops blank and specials, keeps frame spans", () => {
  // vocab: 0 blank, 1 "p", 2 "a", 3 "<unk>"; 6 frames, one-hot logits
  const ids = [1, 1, 0, 2, 3, 2];
  const V = 4, logits = new Float32Array(ids.length * V);
  ids.forEach((id, t) => { logits[t * V + id] = 1; });
  const out = greedyCtc(logits, ids.length, V, ["<blank>", "p", "a", "<unk>"], 0);
  assert.deepEqual(out, [
    { sym: "p", start: 0, end: 2 },
    { sym: "a", start: 3, end: 4 },
    { sym: "a", start: 5, end: 6 },
  ]);
});

test("diacritic and length tokens attach to the phone before them (ZIPA emits them apart)", () => {
  const ids = [1, 2, 0, 3, 4];
  const V = 5, logits = new Float32Array(ids.length * V);
  ids.forEach((id, t) => { logits[t * V + id] = 1; });
  const out = greedyCtc(logits, ids.length, V, ["<blk>", "t", "̪", "a", "ː"], 0);
  assert.deepEqual(out, [
    { sym: "t̪", start: 0, end: 2 },
    { sym: "aː", start: 3, end: 5 },
  ]);
});

const run = (hyps, models, backbone = models[0]) => vote(align(hyps, models), models, backbone);

test("all agree", () => {
  const out = run({ a: ["p", "a"], b: ["p", "a"], c: ["p", "a"] }, ["a", "b", "c"]);
  assert.deepEqual(out.map(s => [s.sym, s.agreed]), [["p", true], ["a", true]]);
});

test("majority substitution wins", () => {
  const out = run({ a: ["p", "a"], b: ["b", "a"], c: ["b", "a"] }, ["a", "b", "c"]);
  assert.deepEqual(out.map(s => s.sym), ["b", "a"]);
});

test("one model's insertion is dropped, one model's deletion ignored", () => {
  assert.deepEqual(run({ a: ["p", "a"], b: ["p", "x", "a"], c: ["p", "a"] }, ["a", "b", "c"]).map(s => s.sym), ["p", "a"]);
  assert.deepEqual(run({ a: ["p", "a", "t"], b: ["p", "a"], c: ["p", "a", "t"] }, ["a", "b", "c"]).map(s => s.sym), ["p", "a", "t"]);
});

test("no majority: backbone symbol, flagged, alternatives listed", () => {
  const [slot] = run({ a: ["p"], b: ["b"], c: ["m"] }, ["a", "b", "c"]);
  assert.equal(slot.sym, "p");
  assert.equal(slot.agreed, false);
  assert.deepEqual(slot.alternatives, { p: ["a"], b: ["b"], m: ["c"] });
});

test("five models need three; a model that did not run is not counted", () => {
  const m = ["a", "b", "c", "d", "e"];
  assert.equal(run({ a: ["p"], b: ["p"], c: ["b"], d: ["b"], e: ["m"] }, m)[0].agreed, false);
  // `models` lists only the models that ran: 2 of 3 is a majority
  assert.equal(run({ a: ["p"], b: ["p"], c: ["b"] }, ["a", "b", "c"])[0].agreed, true);
  assert.equal(run({ a: ["p"], b: ["b"] }, ["a", "b"])[0].agreed, false);
});

test("symbols may carry timing objects", () => {
  const hyps = { a: [{ sym: "p", start: 0, end: 2 }], b: [{ sym: "p", start: 1, end: 3 }], c: [{ sym: "p", start: 0, end: 2 }] };
  const [slot] = vote(align(hyps, ["a", "b", "c"]), ["a", "b", "c"], "a");
  assert.equal(slot.sym, "p");
  assert.deepEqual([slot.start, slot.end], [0, 2]);
});
