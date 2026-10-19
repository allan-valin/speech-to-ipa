import { test } from "node:test";
import assert from "node:assert/strict";
import { grid } from "../web/app/vote.js";
import { insertLeft, insertRight, swap, addMark, removeAt } from "../web/app/edit.js";

const P = (sym, start) => ({ sym, start, end: start + 0.1 });

test("grid puts the same sound of every model in one column, gaps where a model has none", () => {
  const results = {
    a: [P("p", 0), P("a", 0.2)],
    b: [P("p", 0), P("ʰ", 0.1), P("a", 0.2)],
    c: [P("b", 0), P("a", 0.2)],
  };
  const g = grid(results, ["a", "b", "c"]);
  assert.equal(g.length, 3);
  assert.deepEqual(g.map(col => col.cells.a?.sym ?? null), ["p", null, "a"]);
  assert.deepEqual(g.map(col => col.cells.b?.sym ?? null), ["p", "ʰ", "a"]);
  assert.deepEqual(g.map(col => col.cells.c?.sym ?? null), ["b", null, "a"]);
  // consensus per column: "p" by 2 of 3, nothing by 2 of 3 (empty), "a" by 3
  assert.deepEqual(g.map(col => col.cons.sym), ["p", "", "a"]);
  assert.deepEqual(g.map(col => col.cons.agreed), [true, true, true]);
});

test("grid keeps a model whose result is empty (it ran, heard nothing)", () => {
  const g = grid({ a: [P("o", 0)], b: [], c: [] }, ["a", "b", "c"]);
  assert.equal(g.length, 1);
  assert.equal(g[0].cells.b, null);
  assert.equal(g[0].cons.sym, "");              // two of three heard nothing: majority empty
});

test("editor operations return new arrays and never touch the input", () => {
  const s = ["p", "a"];
  assert.deepEqual(insertLeft(s, 1, "ʰ"), ["p", "ʰ", "a"]);
  assert.deepEqual(insertRight(s, 1, "t"), ["p", "a", "t"]);
  assert.deepEqual(swap(s, 0, "b"), ["b", "a"]);
  assert.deepEqual(addMark(s, 1, "̃"), ["p", "ã"]);
  assert.deepEqual(addMark(s, 1, "ː"), ["p", "aː"]);
  assert.deepEqual(removeAt(s, 0), ["a"]);
  assert.deepEqual(s, ["p", "a"]);
  assert.deepEqual(insertRight([], -1, "a"), ["a"]);          // empty consensus: first symbol
});
