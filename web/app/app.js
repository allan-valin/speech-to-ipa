import { MODELS, ORDER } from "./models.js";
import * as engine from "./engine.js";
import * as store from "./store.js";
import { grid } from "./vote.js";
import { bundle, zip, zipAll, consensus } from "./export.js";
import { recordingsFrom } from "./importer.js";
import { insertLeft, insertRight, swap, addMark, removeAt } from "./edit.js";
import { CHART, shown } from "./ipachart.js";
import { t, LANGS, setLang, lang, applyStatic, helpHtml, sourcesHtml } from "./i18n.js";

const $ = id => document.getElementById(id);
const byId = Object.fromEntries(MODELS.map(m => [m.id, m]));
let recorder = null, chunks = [], recStart = 0, recTimer = null;
let current = null;          // the recording on screen
let working = false;

// ---------- feedback: every action answers next to where it happened, and in the log ----------
function log(msg) {
  const line = `[${new Date().toLocaleTimeString(lang())}] ${msg}`;
  $("log").textContent = line + "\n" + $("log").textContent;
}
function say(msg, kind = "") {
  $("status").textContent = msg;
  $("status").className = "status " + kind;
  log(msg);
}
function progress(label, f) {
  if (label === null) { $("progress").hidden = true; return; }
  $("progress").hidden = false;
  $("progress-label").textContent = label;
  $("progress").querySelector(".bar div").style.width = `${Math.round(f * 100)}%`;
}

// ---------- preferences (per viewer, optional) ----------
function pref(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function setPref(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } }
const RECOMMENDED = MODELS.filter(m => m.recommended).map(m => m.id);

// ---------- light / dark ----------
function applyTheme() {
  const th = pref("theme", null);                  // null: follow the system
  if (th) document.documentElement.dataset.theme = th; else delete document.documentElement.dataset.theme;
  const dark = th ? th === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  $("theme-btn").textContent = dark ? "☀" : "☾";
  $("theme-btn").title = t(dark ? "theme.toLight" : "theme.toDark");
  return dark;
}
function toggleTheme() {
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  setPref("theme", dark ? "light" : "dark");
  say(t(applyTheme() ? "theme.dark" : "theme.light"));
}

// ---------- language ----------
function renderLangs() {
  for (const box of [$("langs"), $("langs-menu")]) {
    box.innerHTML = "";
    for (const l of LANGS) {
      const b = document.createElement("button");
      b.className = "langflag" + (l.code === lang() ? " on" : "");
      b.title = l.name; b.setAttribute("aria-label", l.name);
      b.innerHTML = `<img src="flags/${l.flag}.svg" alt=""><span>${l.short}</span>`;
      b.onclick = () => { setLang(l.code); setPref("lang", l.code); refreshTexts(); say(t("lang.set", { name: l.name })); };
      box.append(b);
    }
  }
}
function refreshTexts() {
  applyStatic(document);
  applyTheme();
  renderLangs(); renderModels(); renderRecordings(); render(); renderMenuText(); checkMicPermission();
}
function renderMenuText() {
  $("help").innerHTML = helpHtml();
  $("sources").innerHTML = sourcesHtml(MODELS);
}

// ---------- ☰ menu and dialogs ----------
function openMenu(tab = "options") {
  $("overlay").hidden = false;
  for (const b of document.querySelectorAll("[data-tab]")) b.setAttribute("aria-selected", String(b.dataset.tab === tab));
  for (const p of document.querySelectorAll("[data-pane]")) p.hidden = p.dataset.pane !== tab;
  log(t("menu.opened", { tab: t("menu." + tab) }));
}
function closeOverlays() { for (const o of document.querySelectorAll(".overlay")) o.hidden = true; }

/** Ask before downloading models that are not in the browser yet. Resolves true to go ahead. */
async function confirmDownloads(models) {
  const missing = [];
  for (const m of models) if (!(await engine.isCached(m))) missing.push(m);
  if (!missing.length) return true;
  const mb = missing.reduce((a, m) => a + m.mb, 0);
  $("dl-list").innerHTML = missing.map(m => `<li>${m.name} — ${size(m.mb)}</li>`).join("")
    + `<li><b>${t("dl.total")}: ${size(mb)}</b></li>`;
  $("confirm").hidden = false;
  return new Promise(resolve => {
    $("dl-yes").onclick = async () => {
      $("confirm").hidden = true;
      // asked here, right after the person said yes: the browser may show its own question now
      try { await navigator.storage?.persist?.(); } catch { /* not supported */ }
      resolve(true);
    };
    $("dl-no").onclick = () => { $("confirm").hidden = true; resolve(false); };
  });
}
const size = mb => (mb >= 1000 ? `${(mb / 1000).toFixed(1).replace(".", t("dec"))} GB` : `${mb} MB`);

// ---------- microphone: open only while recording ----------
async function checkMicPermission() {
  try {
    const p = await navigator.permissions.query({ name: "microphone" });
    const show = () => {
      $("mic-state").textContent = t("mic.st." + p.state);
      $("mic-help").hidden = p.state !== "denied";
      $("mic").disabled = p.state === "granted";
    };
    show(); p.onchange = show;
  } catch { $("mic-state").textContent = ""; }   // Permissions API missing (some Safari versions)
}

async function openMic() {
  try { return await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) {
    $("mic-help").hidden = false;
    say(t("mic.denied", { err: e.name }), "bad");
    openMenu("options");
    return null;
  }
}

async function allowMic() {
  const s = await openMic();
  if (!s) return;
  s.getTracks().forEach(tr => tr.stop());       // permission kept, microphone off
  say(t("mic.ok"), "good");
  checkMicPermission();
}

async function toggleRecording() {
  if (recorder?.state === "recording") { recorder.stop(); return; }
  if (working) { say(t("busy"), "bad"); return; }
  const stream = await openMic();
  if (!stream) return;
  chunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = async () => {
    stream.getTracks().forEach(tr => tr.stop());   // the browser's mic indicator goes off here
    clearInterval(recTimer);
    setRecButton(false);
    say(t("rec.stopped"));
    await newRecording(await new Blob(chunks).arrayBuffer(), t("rec.label"));
  };
  recorder.start();
  recStart = performance.now();
  recTimer = setInterval(() => { $("rec-time").textContent = secs((performance.now() - recStart) / 1000); }, 100);
  setRecButton(true);
  say(t("rec.recording"), "live");
}
function setRecButton(on) {
  $("rec").classList.toggle("on", on);
  $("rec").firstElementChild.className = "shape " + (on ? "stop" : "play");
  $("rec").title = t(on ? "rec.stop" : "rec.start");
  $("rec-time").hidden = !on;
  $("rec-time").textContent = secs(0);
}
const secs = s => `${s.toFixed(1).replace(".", t("dec"))} s`;

async function to16kMono(buf) {
  // Decoding in a 16 kHz context resamples once (and not at all for 16 kHz files);
  // a default 48 kHz context would resample twice and shift the models' output.
  const ctx = new AudioContext({ sampleRate: 16000 });
  const decoded = await ctx.decodeAudioData(buf);
  ctx.close();
  if (decoded.numberOfChannels === 1 && decoded.sampleRate === 16000) return decoded.getChannelData(0);
  const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * 16000)), 16000);
  const src = off.createBufferSource();
  src.buffer = decoded; src.connect(off.destination); src.start();
  return (await off.startRendering()).getChannelData(0);
}

async function newRecording(buf, label) {
  let wav;
  try { wav = await to16kMono(buf); } catch (e) { say(t("audio.bad", { err: e.message }), "bad"); return; }
  current = { id: crypto.randomUUID(), created: Date.now(), label, wav, results: {} };
  try { await store.save(current); } catch (e) { log(t("store.bad", { err: e.message })); }
  const peak = wav.reduce((a, x) => Math.max(a, Math.abs(x)), 0);
  if (peak < 0.01) say(t("audio.silent", { s: secs(wav.length / 16000) }), "bad");
  else say(t("audio.got", { s: secs(wav.length / 16000) }));
  renderRecordings();
  render();
  await runModels(checked());
}

// ---------- models ----------
function chosen() { return pref("models", RECOMMENDED); }
function checked() { return MODELS.filter(m => m.ready && chosen().includes(m.id)); }

async function renderModels() {
  const box = $("models");
  box.innerHTML = "";
  for (const [group, list] of [["opt.recommended", MODELS.filter(m => m.recommended)], ["opt.others", MODELS.filter(m => !m.recommended)]]) {
    const h = document.createElement("h4"); h.textContent = t(group); box.append(h);
    for (const m of list) {
      const row = document.createElement("label");
      row.className = "model";
      const cached = m.ready && await engine.isCached(m);
      const state = !m.ready ? t("model.soon") : cached ? t("model.cached") : t("model.toDownload", { size: size(m.mb) });
      row.innerHTML = `<input type="checkbox" ${m.ready ? "" : "disabled"} ${m.ready && chosen().includes(m.id) ? "checked" : ""}>
        <span class="name">${m.name}<small>PER ${m.gold.per} · PFER ${m.gold.pfer} · ${m.license}</small></span><span class="state">${state}</span>`;
      if (cached) {
        const drop = document.createElement("button");
        drop.textContent = t("model.delete"); drop.className = "small";
        drop.onclick = async e => {
          e.preventDefault();
          await engine.forget(m);
          say(t("model.deleted", { name: m.name, size: size(m.mb) }));
          renderModels();
        };
        row.append(drop);
      }
      row.querySelector("input").onchange = e => {
        const now = new Set(chosen());
        e.target.checked ? now.add(m.id) : now.delete(m.id);
        setPref("models", ORDER.filter(id => now.has(id)));
        say(t(e.target.checked ? "model.on" : "model.off", { name: m.name }));
        updateTotal(); render();
      };
      box.append(row);
    }
  }
  updateTotal();
}

function updateTotal() {
  const sel = checked(), mb = sel.reduce((a, m) => a + m.mb, 0);
  $("total").textContent = t("opt.total", { n: sel.length, size: size(mb) });
  $("heavy").hidden = mb < 900;
}

/** Run `models` on the current recording; `fresh` discards their earlier results first. */
async function runModels(models, fresh = false) {
  if (working) { say(t("busy"), "bad"); return; }
  if (!current) return;
  if (!models.length) { say(t("run.none"), "bad"); openMenu("options"); return; }
  const rec = current;
  const todo = fresh ? models : models.filter(m => !rec.results[m.id]);
  if (!todo.length) { say(t("run.allDone")); render(); return; }
  if (!(await confirmDownloads(todo))) { say(t("dl.declined"), "bad"); return; }
  if (fresh) for (const m of todo) delete rec.results[m.id];
  working = true; render();
  const backend = $("backend").value, together = pref("mode", "seq") === "all";
  const kept = {};
  try {
    for (const [i, m] of todo.entries()) {
      const step = `${i + 1}/${todo.length}`;
      progress(t("run.loading", { name: m.name, step }), i / todo.length);
      const t0 = performance.now();
      const loaded = kept[m.id] || await engine.load(m, backend, (f, fromCache) => progress(fromCache
        ? t("run.reading", { name: m.name, step })
        : t("run.downloading", { name: m.name, step, got: Math.round(f * m.mb), size: m.mb }), (i + f * 0.9) / todo.length));
      log(t("run.loaded", { name: m.name, s: secs((performance.now() - t0) / 1000), how: t(loaded.fromCache ? "run.fromCache" : "run.downloaded") })
        + (loaded.stored === false ? " " + t("run.notStored") : ""));
      progress(t("run.transcribing", { name: m.name, step }), (i + 0.9) / todo.length);
      await new Promise(r => setTimeout(r, 30));      // let the label paint before the model blocks the page
      const t1 = performance.now();
      rec.results[m.id] = await engine.transcribe(m, loaded, rec.wav);
      const got = rec.results[m.id].map(p => p.sym).join("");
      log(`${m.name}: ${got || t("res.nothing")} — ${secs((performance.now() - t1) / 1000)}`);
      if (together) kept[m.id] = loaded; else await loaded.session.release();
      await store.save(rec).catch(() => {});
      if (current === rec) render();
    }
    say(t("run.done", { n: todo.length }), "good");
  } catch (e) {
    say(t("run.error", { err: e.message }), "bad");
  } finally {
    for (const l of Object.values(kept)) await l.session.release().catch(() => {});
    working = false; progress(null);
    renderModels(); renderRecordings(); render();
  }
}

// ---------- result: every model and the consensus, side by side ----------
function ranModels(rec) { return ORDER.filter(id => rec.results[id]); }

function render() {
  if (!current) { $("result").hidden = true; return; }
  $("result").hidden = false;
  const ran = ranModels(current);
  $("result-title").textContent = `${t("res.title")} — ${new Date(current.created).toLocaleString(lang())}`;
  const missing = checked().filter(m => !current.results[m.id]);
  $("run-missing").hidden = !missing.length || working;
  $("run-missing").textContent = t("res.runMissing", { names: missing.map(m => m.name).join(", ") });
  $("redo").disabled = $("edit").disabled = working;
  $("alts").hidden = true;
  const box = $("grid");
  box.innerHTML = "";
  box.classList.toggle("wide", $("opt-wide").checked);
  if (!ran.length) {
    $("ipa-hint").textContent = working ? t("res.working") : t("res.none");
    return renderEdited();
  }
  const cols = grid(Object.fromEntries(ran.map(id => [id, current.results[id]])), ran);
  const aligned = $("opt-align").checked;
  const rows = [...ran.map(id => ({ label: byId[id].name, cells: cols.map((col, k) => {
    const p = col.cells[id];
    return p ? cell(p.sym, k, cols, !col.cons.agreed) : gap(k);
  }) })), { label: t("res.consensus"), cons: true,
    cells: cols.map((col, k) => (col.cons.sym ? cell(col.cons.sym, k, cols, !col.cons.agreed, "cons") : gap(k))) }];
  const slot = (child, isCons) => {
    const d = document.createElement("div");
    d.className = "slot" + (isCons ? " cons" : "");
    if (typeof child === "string") { d.textContent = child; d.classList.add("who"); } else d.append(child);
    return d;
  };
  const table = document.createElement("div");
  if (aligned) {
    // one column per aligned slot, every model stacked inside it: the same sound stays in one column
    table.className = "cols";
    const labels = document.createElement("div"); labels.className = "col labels";
    rows.forEach(r => labels.append(slot(r.label, r.cons)));
    table.append(labels);
    cols.forEach((_, k) => {
      const c = document.createElement("div"); c.className = "col";
      rows.forEach(r => c.append(slot(r.cells[k], r.cons)));
      table.append(c);
    });
  } else {
    table.className = "lines";
    for (const r of rows) {
      const line = document.createElement("div"); line.className = "line" + (r.cons ? " cons" : "");
      line.append(slot(r.label, false));
      const kept = r.cells.filter(c => !c.classList.contains("gap"));
      const seq = document.createElement("div"); seq.className = "seq";
      if (kept.length) kept.forEach(c => seq.append(c));
      else seq.innerHTML = `<span class="muted">${t("res.nothing")}</span>`;
      line.append(seq); table.append(line);
    }
  }
  table.classList.toggle("wrap", $("opt-wrap").checked);
  box.append(table);
  requestAnimationFrame(syncScroll);
  const cons = cols.filter(c => c.cons.sym), flagged = cons.filter(c => !c.cons.agreed).length;
  const empty = ran.filter(id => !current.results[id].length).map(id => byId[id].name);
  $("ipa-hint").textContent = (ran.length < 3 ? t("res.few") : t("res.flagged", { n: flagged, of: cons.length }))
    + (empty.length ? " " + t("res.empty", { names: empty.join(", ") }) : "");
  renderEdited();
}

// a big slider under the result stands in for the scroll bar (phones hide theirs)
function syncScroll() {
  const g = $("grid"), bar = $("grid-scroll"), over = g.scrollWidth - g.clientWidth;
  bar.hidden = over <= 2;
  bar.max = Math.max(over, 0);
  bar.value = g.scrollLeft;
}

/** Time span of a column: from the consensus, else from any model that marks time. */
function spanOf(col) {
  if (col.cons.start !== undefined) return [col.cons.start, col.cons.end];
  const p = Object.values(col.cells).find(x => x && x.start !== undefined);
  return p ? [p.start, p.end] : null;
}

function cell(sym, k, cols, flag, extra = "") {
  const s = document.createElement("button");
  s.className = `ph ${extra}${flag ? " flag" : ""}`;
  s.textContent = sym;
  s.dataset.col = k;
  s.onclick = () => {
    document.querySelectorAll(".ph.sel").forEach(x => x.classList.remove("sel"));
    document.querySelectorAll(`.ph[data-col="${k}"]`).forEach(x => x.classList.add("sel"));
    const span = spanOf(cols[k]);
    if (span) play(span[0], span[1]); else say(t("play.noTime"));
    showAlternatives(cols[k]);
  };
  return s;
}
function gap(k) {
  const s = document.createElement("span");
  s.className = "ph gap"; s.dataset.col = k; s.textContent = "·";
  return s;
}

function showAlternatives(col) {
  const d = col.cons;
  const parts = Object.entries(d.alternatives).map(([sym, who]) => `<b>${sym}</b>: ${who.map(id => byId[id].name).join(", ")}`);
  const missing = ranModels(current).filter(id => !col.cells[id]);
  if (missing.length) parts.push(`${t("alt.nothing")}: ${missing.map(id => byId[id].name).join(", ")}`);
  $("alts").innerHTML = t(d.agreed ? "alt.majority" : "alt.noMajority") + " " + parts.join(" · ");
  $("alts").hidden = false;
}

// ---------- playback of the user's own recording ----------
let audioCtx = null;
function play(start = 0, end = null) {
  audioCtx ||= new AudioContext();
  audioCtx.resume?.();
  const buf = audioCtx.createBuffer(1, current.wav.length, 16000);
  buf.copyToChannel(current.wav, 0);
  const src = audioCtx.createBufferSource();
  src.buffer = buf; src.connect(audioCtx.destination);
  const pad = 0.04, from = Math.max(0, start - pad);
  if (end === null) src.start(0, 0); else src.start(0, from, end + pad - from);
  const peak = current.wav.reduce((a, x) => Math.max(a, Math.abs(x)), 0);
  say(end === null ? t(peak < 0.01 ? "play.silent" : "play.all") : t("play.part", { a: start.toFixed(2).replace(".", t("dec")), b: end.toFixed(2).replace(".", t("dec")) }));
}

// ---------- editing the consensus ----------
let draft = null, sel = -1, pickerMode = null;

function renderEdited() {
  const e = current?.edited;
  $("edited-line").hidden = !e;
  if (e) $("edited-line").innerHTML = `<b>${t("ed.yours")}:</b> <span class="ipa-inline">${e.join("")}</span>`;
}
function openEditor() {
  if (!current) return;
  draft = [...(current.edited || consensus(current, ranModels(current)).map(c => c.sym))];
  sel = draft.length - 1;
  $("editor").hidden = false;
  renderDraft();
  say(t("ed.opened"));
}
function renderDraft() {
  const box = $("ed-tokens");
  box.innerHTML = "";
  draft.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "ph" + (i === sel ? " sel" : "");
    b.textContent = s;
    b.onclick = () => { sel = i; renderDraft(); };
    box.append(b);
  });
  if (!draft.length) box.innerHTML = `<span class="muted">${t("ed.empty")}</span>`;
  for (const id of ["ed-swap", "ed-mark", "ed-del"]) $(id).disabled = sel < 0;
}
function needSel() { if (sel < 0 && draft.length) { say(t("ed.pick"), "bad"); return false; } return true; }

function openPicker(mode) {
  if (mode !== "right" && mode !== "left" && !needSel()) return;
  pickerMode = mode;
  const cats = mode === "mark" ? ["diacritics", "suprasegmentals", "tones"]
    : ["vowels", "pulmonic", "nonpulmonic", "other", "diacritics", "suprasegmentals", "tones"];
  $("pk-title").textContent = t("pk.for." + mode);
  $("pk-cats").innerHTML = "";
  for (const c of cats) {
    const b = document.createElement("button");
    b.textContent = t("pk." + c);
    b.onclick = () => { for (const x of $("pk-cats").children) x.classList.remove("on"); b.classList.add("on"); showChart(c); };
    $("pk-cats").append(b);
  }
  $("pk-body").innerHTML = `<p class="muted">${t("pk.title")}</p>`;
  $("picker").hidden = false;
}

function pickButton(sym, label) {
  const b = document.createElement("button");
  b.className = "pk";
  b.textContent = shown(sym);
  if (label) b.title = label;
  b.onclick = () => choose(sym);
  return b;
}

function showChart(cat) {
  const body = $("pk-body");
  body.innerHTML = "";
  if (cat === "vowels") {
    // the trapezoid: front edge slants in as the vowels open; pairs: unrounded left, rounded right
    const wrap = document.createElement("div"); wrap.className = "chart-wrap";
    const box = document.createElement("div"); box.className = "trapezoid";
    box.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <g transform="translate(6 6) scale(.88)"><path d="M2 0 L98 0 L98 100 L42 100 Z M15.3 33.3 L98 33.3 M28.7 66.7 L98 66.7 M50 0 L70 100" fill="none" stroke="currentColor" stroke-width=".5" vector-effect="non-scaling-stroke"/></g></svg>`;
    for (const v of CHART.vowels) {
      const y = v.height / 6, front = 2 + y * 40, x = front + (98 - front) * (v.back / 2);
      const b = pickButton(v.sym, `${t("pk.v.h" + v.height)} · ${t("pk.v.b" + v.back * 2)}${v.rounded === null ? "" : " · " + t(v.rounded ? "pk.v.r" : "pk.v.u")}`);
      const nudge = v.rounded === true ? 3.6 : v.rounded === false ? -3.6 : 0;
      b.style.left = `${6 + (x + nudge) * 0.88}%`;
      b.style.top = `${6 + y * 88}%`;
      box.append(b);
    }
    wrap.append(box); body.append(wrap);
    body.insertAdjacentHTML("beforeend", `<p class="muted">${t("pk.vowelNote")}</p>`);
  } else if (cat === "pulmonic") {
    const { places, manners, merged, cells } = CHART.pulmonic;
    const wrap = document.createElement("div"); wrap.className = "chart-wrap";
    const tb = document.createElement("table"); tb.className = "chart";
    tb.innerHTML = `<tr><th></th>${places.map(p => `<th>${p}</th>`).join("")}</tr>`;
    manners.forEach((mn, r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${mn}</th>`;
      for (let c = 0; c < places.length; c++) {
        const isMerged = merged.includes(mn);
        if (isMerged && (places[c] === "dental" || places[c] === "postalveolar")) continue;
        const td = document.createElement("td");
        if (isMerged && places[c] === "alveolar") td.colSpan = 3;
        const v = cells[r][c];
        if (v === "impossible") td.className = "imp";
        else if (Array.isArray(v)) v.forEach((s, k) => {
          if (s) td.append(pickButton(s, `${k ? "voiced" : "voiceless"} ${places[c]} ${mn}`));
          else if (s === false) td.insertAdjacentHTML("beforeend", `<span class="half imp"></span>`);
          else td.insertAdjacentHTML("beforeend", `<span class="half"></span>`);
        });
        tr.append(td);
      }
      tb.append(tr);
    });
    wrap.append(tb); body.append(wrap);
    body.insertAdjacentHTML("beforeend", `<p class="muted">${t("pk.consNote")}</p>`);
  } else {
    const items = CHART[cat];
    const groups = [...new Set(items.map(d => d.group || ""))];
    for (const g of groups) {
      if (g) body.insertAdjacentHTML("beforeend", `<h4>${g}</h4>`);
      const list = document.createElement("div"); list.className = "pk-list";
      for (const d of items.filter(d => (d.group || "") === g)) {
        const item = document.createElement("div"); item.className = "pk-item";
        item.append(pickButton(d.sym, d.label));
        item.insertAdjacentHTML("beforeend", `<span>${d.label}</span>`);
        list.append(item);
      }
      body.append(list);
    }
  }
}

function choose(sym) {
  const before = draft.join("");
  if (pickerMode === "left") { draft = insertLeft(draft, Math.max(sel, 0), sym); }
  else if (pickerMode === "right") { draft = insertRight(draft, sel, sym); sel++; }
  else if (pickerMode === "swap") draft = swap(draft, sel, sym);
  else if (pickerMode === "mark") draft = addMark(draft, sel, sym);
  $("picker").hidden = true;
  renderDraft();
  say(t("ed.changed", { a: before || "∅", b: draft.join("") || "∅" }));
}

async function saveEdit(value) {
  if (value) current.edited = value; else delete current.edited;
  await store.save(current).catch(() => {});
  $("editor").hidden = true; draft = null;
  render(); renderRecordings();
  say(t(value ? "ed.saved" : "ed.resetDone"), "good");
}

// ---------- export / import ----------
function exportFile() {
  const ran = ranModels(current);
  const files = bundle(current, ran);
  const name = files[0].name.split("/")[0] + ".zip";
  return new File([zip(files, new Date(current.created))], name, { type: "application/zip" });
}

async function saveExport() {
  if (!current || !ranModels(current).length) { say(t("exp.nothing"), "bad"); return; }
  await saveFile(exportFile());
}

async function saveAll() {
  let recs = [];
  try { recs = await store.list(); } catch (e) { say(t("store.readBad", { err: e.message }), "bad"); return; }
  if (!recs.length) { say(t("recs.none"), "bad"); return; }
  say(t("exp.packing", { n: recs.length }));
  const { name, data } = zipAll(recs);
  await saveFile(new File([data], name, { type: "application/zip" }));
}

async function saveFile(file) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({ suggestedName: file.name, types: [{ description: "Zip", accept: { "application/zip": [".zip"] } }] });
      const w = await handle.createWritable();
      await w.write(file); await w.close();
      say(t("exp.saved", { name: handle.name }), "good");
      return;
    } catch (e) {
      if (e.name === "AbortError") { say(t("exp.cancelled")); return; }
      log(t("exp.noPicker", { err: e.message }));
    }
  }
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(file), download: file.name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  say(t("exp.downloading", { name: file.name }), "good");
}

async function shareExport() {
  if (!current || !ranModels(current).length) { say(t("exp.nothing"), "bad"); return; }
  const file = exportFile();
  try { await navigator.share({ files: [file], title: file.name }); say(t("exp.shared"), "good"); }
  catch (e) { say(e.name === "AbortError" ? t("exp.shareCancelled") : t("exp.shareFailed", { err: e.message }), e.name === "AbortError" ? "" : "bad"); }
}

async function importFiles(list) {
  const files = [...list].filter(f => /\.(zip|wav|json)$/i.test(f.name));
  if (!files.length) { say(t("imp.none"), "bad"); return; }
  say(t("imp.reading", { n: files.length }));
  let recs;
  try {
    recs = await recordingsFrom(await Promise.all(files.map(async f => ({ name: f.webkitRelativePath || f.name, data: new Uint8Array(await f.arrayBuffer()) }))));
  } catch (e) { say(t("imp.failed", { err: e.message }), "bad"); return; }
  const have = new Set((await store.list().catch(() => [])).map(r => `${r.created}:${r.wav.length}`));
  let added = 0, skipped = 0;
  for (const r of recs) {
    if (have.has(`${r.created}:${r.wav.length}`)) { skipped++; continue; }
    for (const id of Object.keys(r.results)) if (!byId[id]) delete r.results[id];
    await store.save(r); added++;
  }
  say(t("imp.done", { added, skipped }), added ? "good" : "");
  renderRecordings();
}

// ---------- recordings list ----------
async function renderRecordings() {
  let recs = [];
  try { recs = await store.list(); } catch (e) { log(t("store.readBad", { err: e.message })); }
  const box = $("recordings");
  box.innerHTML = recs.length ? "" : `<p class="muted">${t("recs.none")}</p>`;
  for (const rec of recs) {
    const row = document.createElement("div"); row.className = "rec-item" + (rec.id === current?.id ? " open" : "");
    const ran = ranModels(rec);
    const ipa = rec.edited ? rec.edited.join("") : ran.length ? consensus(rec, ran).map(s => s.sym).join("") : "";
    row.innerHTML = `<span class="muted">${new Date(rec.created).toLocaleString(lang())} · ${secs(rec.wav.length / 16000)}</span>
      ${rec.name ? `<b class="rec-name"></b>` : ""}
      <span class="ipa-mini" title="${ipa}">${ipa || `<span class="muted">${t(ran.length ? "res.nothing" : "recs.noIpa")}</span>`}</span>`;
    if (rec.name) row.querySelector(".rec-name").textContent = rec.name;
    const ren = document.createElement("button"); ren.textContent = t("recs.rename");
    ren.onclick = async () => {
      const v = prompt(t("recs.renamePrompt"), rec.name || "");
      if (v === null) { say(t("recs.renameCancelled")); return; }
      if (v.trim()) rec.name = v.trim(); else delete rec.name;
      await store.save(rec).catch(() => {});
      if (current?.id === rec.id) current = rec;
      say(rec.name ? t("recs.renamed", { name: rec.name }) : t("recs.unnamed"), "good");
      renderRecordings();
    };
    const open = document.createElement("button"); open.textContent = t("recs.open");
    open.onclick = () => {
      current = rec; $("editor").hidden = true;
      render(); renderRecordings();
      say(t("recs.opened"));
      $("result").scrollIntoView({ behavior: "smooth" });
    };
    const del = document.createElement("button"); del.textContent = t("recs.delete");
    del.onclick = async () => {
      if (!confirm(t("recs.confirmDelete"))) return;
      await store.remove(rec.id);
      if (current?.id === rec.id) { current = null; render(); }
      say(t("recs.deleted")); renderRecordings();
    };
    row.append(open, ren, del); box.append(row);
  }
}

// ---------- wiring ----------
$("menu-btn").onclick = () => openMenu("options");
$("theme-btn").onclick = toggleTheme;
$("instructions").open = pref("instructionsOpen", true);
$("instructions").ontoggle = () => setPref("instructionsOpen", $("instructions").open);
for (const b of document.querySelectorAll("[data-tab]")) b.onclick = () => openMenu(b.dataset.tab);
for (const b of document.querySelectorAll("[data-close]")) b.onclick = () => { b.closest(".overlay").hidden = true; log(t("closed")); };
for (const o of [$("overlay"), $("picker")]) o.addEventListener("click", e => { if (e.target === o) o.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeOverlays(); });

$("mic").onclick = allowMic;
$("rec").onclick = toggleRecording;
$("file").onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  say(t("file.chosen", { name: f.name }));
  await newRecording(await f.arrayBuffer(), f.name);
  e.target.value = "";
};
$("redo").onclick = () => {
  if (!current) return;
  say(t("res.redoing"));
  runModels(checked(), true);
};
$("run-missing").onclick = () => runModels(checked());
$("play-all").onclick = () => play();
$("export").onclick = saveExport;
$("export-all").onclick = saveAll;
$("share").onclick = shareExport;
$("imp-dir").onchange = e => { importFiles(e.target.files); e.target.value = ""; };
$("imp-zip").onchange = e => { importFiles(e.target.files); e.target.value = ""; };
$("edit").onclick = openEditor;
$("ed-left").onclick = () => openPicker("left");
$("ed-right").onclick = () => openPicker("right");
$("ed-swap").onclick = () => openPicker("swap");
$("ed-mark").onclick = () => openPicker("mark");
$("ed-del").onclick = () => { if (!needSel()) return; draft = removeAt(draft, sel); sel = Math.min(sel, draft.length - 1); renderDraft(); say(t("ed.deleted")); };
$("ed-save").onclick = () => saveEdit(draft);
$("ed-cancel").onclick = () => { $("editor").hidden = true; draft = null; say(t("ed.cancelled")); };
$("ed-reset").onclick = () => saveEdit(null);
$("grid").addEventListener("scroll", () => { $("grid-scroll").value = $("grid").scrollLeft; });
$("grid-scroll").oninput = e => { $("grid").scrollLeft = +e.target.value; };
new ResizeObserver(syncScroll).observe($("grid"));
for (const [id, key, fallback] of [["opt-wide", "wide", true], ["opt-align", "align", true], ["opt-wrap", "wrap", false]]) {
  $(id).checked = pref(key, fallback);
  $(id).onchange = e => { setPref(key, e.target.checked); render(); say(t(e.target.checked ? "opt.onMsg" : "opt.offMsg", { what: e.target.nextElementSibling.textContent })); };
}
try { $("share").hidden = !navigator.canShare?.({ files: [new File(["x"], "x.zip", { type: "application/zip" })] }); } catch { /* no Web Share */ }
$("backend").value = pref("backend", "wasm");
$("backend").onchange = e => { setPref("backend", e.target.value); say(`${t("opt.backend")}: ${e.target.selectedOptions[0].text}`); };
for (const r of document.querySelectorAll("input[name=mode]")) {
  r.checked = r.value === pref("mode", "seq");
  r.onchange = () => { setPref("mode", r.value); say(t(r.value === "seq" ? "opt.seqMsg" : "opt.allMsg")); };
}

if (window.crossOriginIsolated) ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 8);
setLang(pref("lang", null));
refreshTexts();
log(t("ready", { threads: window.crossOriginIsolated ? ort.env.wasm.numThreads : 1 }));
