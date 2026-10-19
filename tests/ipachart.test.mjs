import { test } from "node:test";
import assert from "node:assert/strict";
import { CHART, allSymbols } from "../web/app/ipachart.js";

test("chart has every section of the IPA chart (2020)", () => {
  assert.deepEqual(Object.keys(CHART), ["vowels", "pulmonic", "nonpulmonic", "other", "diacritics", "suprasegmentals", "tones"]);
});

test("pulmonic table: 11 places x 8 manners, voiceless left / voiced right, the familiar symbols in place", () => {
  const { places, manners, cells } = CHART.pulmonic;
  assert.equal(places.length, 11);
  assert.equal(manners.length, 8);
  const at = (m, p) => cells[manners.indexOf(m)][places.indexOf(p)];
  assert.deepEqual(at("plosive", "bilabial"), ["p", "b"]);
  assert.deepEqual(at("fricative", "dental"), ["θ", "ð"]);
  assert.deepEqual(at("fricative", "postalveolar"), ["ʃ", "ʒ"]);
  assert.deepEqual(at("approximant", "palatal"), [null, "j"]);
  assert.deepEqual(at("lateral fricative", "alveolar"), ["ɬ", "ɮ"]);
  assert.equal(at("nasal", "pharyngeal"), "impossible");
  // 59 pulmonic consonant symbols on the chart
  const n = cells.flat().filter(Array.isArray).flat().filter(Boolean).length;
  assert.equal(n, 59);
});

test("vowels: 28 symbols, each with a height and a backness inside the trapezoid", () => {
  const v = CHART.vowels;
  assert.equal(v.length, 28);
  for (const x of v) {
    assert.ok(x.height >= 0 && x.height <= 6, x.sym);
    assert.ok(x.back >= 0 && x.back <= 2, x.sym);
  }
  const i = v.find(x => x.sym === "i"), u = v.find(x => x.sym === "u"), a = v.find(x => x.sym === "a");
  assert.deepEqual([i.height, i.back, i.rounded], [0, 0, false]);
  assert.deepEqual([u.height, u.back, u.rounded], [0, 2, true]);
  assert.equal(a.height, 6);
});

test("no symbol appears twice across the letter sections", () => {
  const syms = allSymbols(["vowels", "pulmonic", "nonpulmonic", "other"]);
  assert.equal(new Set(syms).size, syms.length);
});

test("diacritics, suprasegmentals and tones carry a mark and a label", () => {
  for (const sec of ["diacritics", "suprasegmentals", "tones"])
    for (const d of CHART[sec]) assert.ok(d.sym && d.label, `${sec}: ${JSON.stringify(d)}`);
  assert.ok(CHART.diacritics.some(d => d.sym === "̥"));   // voiceless ring below
  assert.ok(CHART.suprasegmentals.some(d => d.sym === "ː"));
  assert.ok(CHART.tones.some(d => d.sym === "˥"));
});
