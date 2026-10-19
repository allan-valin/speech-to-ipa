import { MODELS, ORDER } from "./models.js";
import * as engine from "./engine.js";
import * as store from "./store.js";
import { align, vote } from "./vote.js";
import { bundle, zip } from "./export.js";

const $ = id => document.getElementById(id);
const byId = Object.fromEntries(MODELS.map(m => [m.id, m]));
let stream = null, recorder = null, chunks = [];
let current = null;          // the recording on screen
let view = "consensus";
let working = false;

// ---------- feedback: every action leaves a line ----------
function log(msg) {
  const line = `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`;
  $("log").textContent = line + "\n" + $("log").textContent;
}
const busy = f => { $("busy").firstElementChild.style.width = `${Math.round(f * 100)}%`; };

// ---------- preferences (per viewer, optional) ----------
function pref(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function setPref(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } }

// ---------- microphone ----------
async function allowMic() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    $("mic-state").textContent = "Autorizado.";
    $("mic").disabled = true; $("mic-help").hidden = true; $("rec").disabled = false;
    log("Microfone autorizado.");
  } catch (e) {
    $("mic-state").textContent = "Bloqueado.";
    $("mic-help").hidden = false;
    log(`Microfone não autorizado (${e.name}). Veja como liberar logo acima.`);
  }
}

async function checkMicPermission() {
  try {
    const p = await navigator.permissions.query({ name: "microphone" });
    if (p.state === "granted") await allowMic();
    else if (p.state === "denied") { $("mic-state").textContent = "Bloqueado."; $("mic-help").hidden = false; }
  } catch { /* Permissions API not available (e.g. some Safari versions) */ }
}

function toggleRecording() {
  if (recorder?.state === "recording") { recorder.stop(); return; }
  chunks = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = async () => {
    $("rec").textContent = "Gravar"; $("rec").classList.remove("on");
    log("Gravação encerrada.");
    await newRecording(await new Blob(chunks).arrayBuffer(), "Gravação");
  };
  recorder.start();
  $("rec").textContent = "Parar"; $("rec").classList.add("on");
  log("Gravando… toque em Parar quando terminar.");
}

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
  try { wav = await to16kMono(buf); } catch (e) { log(`Não consegui ler esse áudio (${e.message}).`); return; }
  current = { id: crypto.randomUUID(), created: Date.now(), label, wav, results: {} };
  try { await store.save(current); } catch (e) { log(`A gravação não pôde ser guardada no navegador (${e.message}).`); }
  log(`${label}: ${(wav.length / 16000).toFixed(1)} s de áudio.`);
  await runModels();
}

// ---------- models ----------
function checked() { return MODELS.filter(m => m.ready && pref("models", ORDER).includes(m.id)); }

async function renderModels() {
  const chosen = pref("models", ORDER);
  $("models").innerHTML = "";
  for (const m of MODELS) {
    const row = document.createElement("label");
    row.className = "model";
    const state = !m.ready ? "em breve" : (await engine.isCached(m)) ? "baixado" : `${m.mb} MB a baixar`;
    row.innerHTML = `<input type="checkbox" ${m.ready ? "" : "disabled"} ${m.ready && chosen.includes(m.id) ? "checked" : ""}>
      <span class="name">${m.name}</span><span class="state">${state}</span>`;
    row.querySelector("input").onchange = e => {
      const now = new Set(pref("models", ORDER));
      e.target.checked ? now.add(m.id) : now.delete(m.id);
      setPref("models", ORDER.filter(id => now.has(id)));
      log(`${m.name} ${e.target.checked ? "marcado" : "desmarcado"}.`);
      updateTotal();
    };
    $("models").append(row);
  }
  updateTotal();
}

function updateTotal() {
  const sel = checked(), mb = sel.reduce((a, m) => a + m.mb, 0);
  $("total").textContent = `${sel.length} modelo(s) marcado(s), ${mb >= 1000 ? (mb / 1000).toFixed(1) + " GB" : mb + " MB"} no total. `
    + `WhIPA ainda não roda no navegador.`;
  $("heavy").hidden = mb < 900;
}

async function runModels() {
  if (working) { log("Já estou transcrevendo; espere terminar."); return; }
  const todo = checked().filter(m => !current.results[m.id]);
  if (!todo.length) { log("Todos os modelos marcados já rodaram nesta gravação."); render(); return; }
  working = true;
  const backend = $("backend").value, together = document.querySelector("input[name=mode]:checked").value === "all";
  const kept = {};
  try {
    for (const [i, m] of todo.entries()) {
      log(`${m.name}: carregando (${i + 1} de ${todo.length})…`);
      const t0 = performance.now();
      const loaded = kept[m.id] || await engine.load(m, backend, f => busy((i + f) / todo.length));
      log(`${m.name}: ${loaded.fromCache ? "lido do cache" : "baixado"}${loaded.stored === false ? " (não coube no cache do navegador)" : ""}, `
        + `pronto em ${((performance.now() - t0) / 1000).toFixed(1)} s. Transcrevendo…`);
      const t1 = performance.now();
      current.results[m.id] = await engine.transcribe(m, loaded, current.wav);
      log(`${m.name}: ${current.results[m.id].map(p => p.sym).join("") || "(nada)"} — ${((performance.now() - t1) / 1000).toFixed(1)} s.`);
      if (together) kept[m.id] = loaded; else await loaded.session.release();
      await store.save(current).catch(() => {});
      render();
    }
  } catch (e) {
    log(`ERRO: ${e.message}. Se o navegador travou, tente "Um de cada vez" ou menos modelos.`);
  } finally {
    for (const l of Object.values(kept)) await l.session.release().catch(() => {});
    working = false; busy(0);
    renderModels(); renderRecordings();
  }
}

// ---------- result views ----------
function ranModels(rec) { return ORDER.filter(id => rec.results[id]); }

function consensus(rec) {
  const ran = ranModels(rec);
  return vote(align(Object.fromEntries(ran.map(id => [id, rec.results[id]])), ran), ran, ran[0]);
}

function render() {
  if (!current) return;
  $("result").hidden = false;
  const ran = ranModels(current);
  $("result-title").textContent = `Resultado — ${new Date(current.created).toLocaleString("pt-BR")}`;
  if (view !== "consensus" && view !== "stack" && !ran.includes(view)) view = "consensus";
  const views = [["consensus", "Consenso"], ...ran.map(id => [id, byId[id].name]), ["stack", "Todos"]];
  $("views").innerHTML = "";
  for (const [id, name] of views) {
    const b = document.createElement("button");
    b.textContent = name; b.setAttribute("role", "tab"); b.setAttribute("aria-pressed", String(view === id));
    b.onclick = () => { view = id; log(`Visualização: ${name}.`); render(); };
    $("views").append(b);
  }
  $("alts").hidden = true;
  const box = $("ipa");
  box.innerHTML = ""; box.classList.toggle("stack", view === "stack");
  if (!ran.length) { $("ipa-hint").textContent = "Nenhum modelo rodou ainda."; return; }
  const cons = consensus(current);
  if (view === "consensus") {
    cons.forEach(slot => box.append(phone(slot.sym, slot, !slot.agreed, () => showAlternatives(slot))));
    const flagged = cons.filter(s => !s.agreed).length;
    $("ipa-hint").textContent = ran.length < 3
      ? "Com menos de 3 modelos, o consenso vale pouco. Toque num símbolo para ouvir o trecho."
      : `${flagged} de ${cons.length} símbolo(s) sem maioria (destacados). Toque num símbolo para ouvir o trecho e ver as alternativas.`;
  } else if (view === "stack") {
    for (const id of ran) {
      const line = document.createElement("div"); line.className = "line";
      line.innerHTML = `<span class="who">${byId[id].name}</span>`;
      const seq = document.createElement("span");
      current.results[id].forEach(p => seq.append(phone(p.sym, p, false)));
      line.append(seq); box.append(line);
    }
    const line = document.createElement("div"); line.className = "line";
    line.innerHTML = `<span class="who"><b>Consenso</b></span>`;
    const seq = document.createElement("span");
    cons.forEach(slot => seq.append(phone(slot.sym, slot, !slot.agreed, () => showAlternatives(slot))));
    line.append(seq); box.append(line);
    $("ipa-hint").textContent = "Cada linha é um modelo. Toque num símbolo para ouvir o trecho.";
  } else {
    // one model; mark the phones that differ from the consensus
    const agreedSyms = new Set(cons.filter(s => s.agreed).map(s => s.slot[view]).filter(Boolean));
    current.results[view].forEach(p => box.append(phone(p.sym, p, !agreedSyms.has(p))));
    $("ipa-hint").textContent = `${byId[view].name}. Destacados: símbolos que não entraram no consenso por maioria.`;
  }
}

function phone(sym, timed, flag, onTap) {
  const s = document.createElement("span");
  s.className = "ph" + (flag ? " flag" : "");
  s.textContent = sym;
  s.onclick = () => {
    document.querySelectorAll(".ph.sel").forEach(x => x.classList.remove("sel"));
    s.classList.add("sel");
    if (timed?.start !== undefined) play(timed.start, timed.end);
    onTap?.();
  };
  return s;
}

function showAlternatives(slot) {
  const parts = Object.entries(slot.alternatives).map(([sym, who]) => `<b>${sym}</b>: ${who.map(id => byId[id].name).join(", ")}`);
  const missing = ranModels(current).filter(id => !Object.values(slot.alternatives).flat().includes(id));
  if (missing.length) parts.push(`nada: ${missing.map(id => byId[id].name).join(", ")}`);
  $("alts").innerHTML = (slot.agreed ? "Maioria. " : "Sem maioria. ") + parts.join(" · ");
  $("alts").hidden = false;
}

// ---------- playback of the user's own recording ----------
let audioCtx = null;
function play(start = 0, end = null) {
  audioCtx ||= new AudioContext();
  const buf = audioCtx.createBuffer(1, current.wav.length, 16000);
  buf.copyToChannel(current.wav, 0);
  const src = audioCtx.createBufferSource();
  src.buffer = buf; src.connect(audioCtx.destination);
  const pad = 0.04, from = Math.max(0, start - pad);
  if (end === null) src.start(0, 0); else src.start(0, from, end + pad - from);
  log(end === null ? "Tocando a gravação." : `Tocando ${start.toFixed(2)}–${end.toFixed(2)} s.`);
}

// ---------- export ----------
function exportFile() {
  const ran = ranModels(current);
  const files = bundle(current, ran);
  const name = files[0].name.replace(/\.wav$/, ".zip");
  return new File([zip(files, new Date(current.created))], name, { type: "application/zip" });
}

async function saveExport() {
  if (!current || !ranModels(current).length) { log("Nada para exportar: rode pelo menos um modelo."); return; }
  const file = exportFile();
  if (window.showSaveFilePicker) {
    try {
      const handle = await showSaveFilePicker({ suggestedName: file.name, types: [{ description: "Zip", accept: { "application/zip": [".zip"] } }] });
      const w = await handle.createWritable();
      await w.write(file); await w.close();
      log(`Exportado: ${handle.name}.`);
      return;
    } catch (e) {
      if (e.name === "AbortError") { log("Exportação cancelada."); return; }
      log(`Janela "salvar como" indisponível (${e.message}); baixando o arquivo.`);
    }
  }
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(file), download: file.name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  log(`Baixando ${file.name}. O navegador pode perguntar onde salvar.`);
}

async function shareExport() {
  if (!current || !ranModels(current).length) { log("Nada para compartilhar: rode pelo menos um modelo."); return; }
  const file = exportFile();
  try { await navigator.share({ files: [file], title: file.name }); log("Compartilhado."); }
  catch (e) { log(e.name === "AbortError" ? "Compartilhamento cancelado." : `Não deu para compartilhar (${e.message}).`); }
}

// ---------- recordings list ----------
async function renderRecordings() {
  let recs = [];
  try { recs = await store.list(); } catch (e) { log(`Não consegui ler as gravações guardadas (${e.message}).`); }
  const box = $("recordings");
  box.innerHTML = recs.length ? "" : `<p class="muted">Nenhuma gravação ainda.</p>`;
  for (const rec of recs) {
    const row = document.createElement("div"); row.className = "rec-item";
    const ipa = ranModels(rec).length ? consensus(rec).map(s => s.sym).join("") : "(sem transcrição)";
    row.innerHTML = `<span class="muted">${new Date(rec.created).toLocaleString("pt-BR")} · ${(rec.wav.length / 16000).toFixed(1)} s</span>
      <span class="ipa-mini">${ipa}</span>`;
    const open = document.createElement("button"); open.textContent = "Abrir";
    open.onclick = () => { current = rec; view = "consensus"; render(); log("Gravação aberta."); $("result").scrollIntoView({ behavior: "smooth" }); };
    const del = document.createElement("button"); del.textContent = "Apagar";
    del.onclick = async () => {
      if (!confirm("Apagar esta gravação do navegador?")) return;
      await store.remove(rec.id);
      if (current?.id === rec.id) { current = null; $("result").hidden = true; }
      log("Gravação apagada."); renderRecordings();
    };
    row.append(open, del); box.append(row);
  }
}

function renderCredits() {
  $("credits").innerHTML = "Modelos: " + MODELS.map(m =>
    `<a href="${m.source}">${m.name}</a> (${m.credit}, <a href="${m.licenseUrl}">${m.license}</a>${m.copy ? `; <a href="${m.copy}">cópia convertida</a>` : ""})`
  ).join(" · ") + ". Uso não comercial. <a href=\"https://github.com/allan-valin/speech-to-ipa\">Código-fonte</a>.";
}

// ---------- wiring ----------
$("mic").onclick = allowMic;
$("rec").onclick = toggleRecording;
$("file").onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  log(`Arquivo escolhido: ${f.name}.`);
  await newRecording(await f.arrayBuffer(), f.name);
  e.target.value = "";
};
$("rerun").onclick = () => { log("Rodando os modelos marcados que faltam nesta gravação…"); runModels(); };
$("play-all").onclick = () => play();
$("export").onclick = saveExport;
$("share").onclick = shareExport;
try { $("share").hidden = !navigator.canShare?.({ files: [new File(["x"], "x.zip", { type: "application/zip" })] }); } catch { /* no Web Share */ }
$("backend").value = pref("backend", "wasm");
$("backend").onchange = e => { setPref("backend", e.target.value); log(`Processamento: ${e.target.selectedOptions[0].text}.`); };
for (const r of document.querySelectorAll("input[name=mode]")) {
  r.checked = r.value === pref("mode", "seq");
  r.onchange = () => { setPref("mode", r.value); log(r.value === "seq" ? "Modo: um de cada vez." : "Modo: todos ao mesmo tempo."); };
}

renderCredits();
renderModels();
renderRecordings();
checkMicPermission();
log("Pronto. Autorize o microfone e grave, ou escolha um arquivo de áudio.");
