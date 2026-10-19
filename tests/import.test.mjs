import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { zip, bundle, wavBytes, zipAll } from "../web/app/export.js";
import { readZip, parseWav, recordingsFrom } from "../web/app/importer.js";

const rec = {
  id: "x", created: new Date(2026, 9, 20, 9, 30, 5).getTime(), label: "opa",
  wav: Float32Array.from({ length: 1600 }, (_, i) => Math.sin(i / 10) * 0.5),
  results: { phoneticxeus: [{ sym: "o", start: 0, end: 0.05 }], zipa: [], multipa: [{ sym: "o", start: 0, end: 0.05 }] },
  edited: ["o", "p", "a"],
};
const ran = ["phoneticxeus", "zipa", "multipa"];

test("export puts every file inside one folder; names start with the date, then kind, length, IPA", () => {
  const files = bundle(rec, ran);
  const base = "2026-10-20_09-30-05_ipa_0.1s_opa";        // the edit wins over the consensus
  assert.ok(files.every(f => f.name.startsWith(`${base}/${base}.`)), files[0].name);
  const txt = new TextDecoder().decode(files.find(f => f.name.endsWith(".txt")).data);
  assert.match(txt, /Editado: opa/);
});

test("WAV round trip keeps 16-bit precision", () => {
  const back = parseWav(wavBytes(rec.wav));
  assert.equal(back.rate, 16000);
  assert.equal(back.samples.length, rec.wav.length);
  assert.ok(Math.max(...back.samples.map((x, i) => Math.abs(x - rec.wav[i]))) < 1e-4);
});

test("our own zip reads back into the same recording", async () => {
  const z = zip(bundle(rec, ran), new Date(rec.created));
  const files = await readZip(z);
  assert.equal(files.length, 4);
  const [back] = await recordingsFrom(files);
  assert.equal(back.created, rec.created);
  assert.equal(back.label, "opa");
  assert.deepEqual(back.results, rec.results);
  assert.deepEqual(back.edited, ["o", "p", "a"]);
  assert.equal(back.wav.length, rec.wav.length);
});

test("a zip re-packed with deflate (e.g. by the system zip tool) also reads", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ipa-"));
  for (const f of bundle(rec, ran)) {
    execFileSync("mkdir", ["-p", join(dir, f.name.split("/")[0])]);
    writeFileSync(join(dir, f.name), f.data);
  }
  execFileSync("zip", ["-q", "-r", "-9", "out.zip", "2026-10-20_09-30-05_ipa_0.1s_opa"], { cwd: dir });
  const files = await readZip(new Uint8Array(readFileSync(join(dir, "out.zip"))));
  const recs = await recordingsFrom(files);
  assert.equal(recs.length, 1);
  assert.deepEqual(recs[0].results, rec.results);
});

test("loose files from an unzipped folder group by name; two recordings stay two", async () => {
  const other = { ...rec, created: rec.created + 60000 };
  const loose = [...bundle(rec, ran), ...bundle(other, ran)].map(f => ({ name: f.name.split("/").pop(), data: f.data }));
  const recs = await recordingsFrom(loose);
  assert.equal(recs.length, 2);
});

test("names never carry characters that file systems refuse", () => {
  const odd = { ...rec, edited: ["a", "|", "b", "‖", "/", "c"] };
  const name = bundle(odd, ran)[0].name.split("/")[0];
  assert.doesNotMatch(name, /[\\/:*?"<>|‖]/);
});

test("export all: one zip, one folder per recording, readable back", async () => {
  const other = { ...rec, created: rec.created + 60000, edited: undefined };
  const z = zipAll([rec, other], new Date(2026, 9, 20, 10, 0, 0));
  assert.match(z.name, /^2026-10-20_10-00-00_ipa_2-recordings\.zip$/);
  const files = await readZip(z.data);
  assert.equal(new Set(files.map(f => f.name.split("/")[0])).size, 2);
  assert.equal((await recordingsFrom(files)).length, 2);
});

test("the system unzip keeps IPA in file names (Info-ZIP Unicode path field)", () => {
  const dir = mkdtempSync(join(tmpdir(), "ipa-"));
  writeFileSync(join(dir, "a.zip"), zip(bundle({ ...rec, edited: ["ɐ̃", "ʃ"] }, ran), new Date(rec.created)));
  execFileSync("unzip", ["-q", "a.zip"], { cwd: dir });
  const names = execFileSync("ls", [dir]).toString();
  assert.match(names, /2026-10-20_09-30-05_ipa_0\.1s_ɐ̃ʃ/);
});
