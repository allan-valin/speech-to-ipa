import { test } from "node:test";
import assert from "node:assert/strict";
import { LANGS, t, setLang } from "../web/app/i18n.js";

const pt = LANGS[0].dict;
const holes = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(",");

for (const l of LANGS.slice(1)) {
  test(`${l.code}: same keys as Portuguese, same placeholders, same help sections`, () => {
    assert.deepEqual(Object.keys(l.dict).sort(), Object.keys(pt).sort());
    for (const k of Object.keys(pt)) assert.equal(holes(l.dict[k]), holes(pt[k]), `${l.code} ${k}`);
    const tags = s => (s.match(/<(h3|li|a |ol|ul)/g) || []).length;
    assert.equal(tags(l.dict["help.html"]), tags(pt["help.html"]), `${l.code} help structure`);
    assert.match(l.dict["help.html"], /speech-to-ipa#run-it-locally/);
  });
}

test("placeholders are filled; unknown language falls back to pt-BR", () => {
  setLang("xx");
  assert.equal(t("model.on", { name: "ZIPA" }), "ZIPA marcado.");
  setLang("en-GB");
  assert.equal(t("model.on", { name: "ZIPA" }), "ZIPA selected.");
  setLang("pt-BR");
});

test("a key missing from a stale cached dictionary falls back to the page's own text, never the key", async () => {
  const { applyStatic } = await import("../web/app/i18n.js");
  const el = { dataset: { i18n: "no.such.key" }, textContent: "Exportar todas" };
  const root = { querySelectorAll: sel => (sel === "[data-i18n]" ? [el] : []) };
  globalThis.document ??= { title: "" };
  applyStatic(root);
  assert.equal(el.textContent, "Exportar todas");
});
