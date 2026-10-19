export default {
  dec: ".",
  title: "Speech → IPA",
  tagline: "Narrow phonetic transcription of what was said, not of what the dictionary says. Everything runs on your device; the audio never leaves it.",
  menu: "Menu", close: "Close", closed: "Window closed.",
  "menu.options": "Options", "menu.sources": "Sources", "menu.help": "Help", "menu.opened": "Menu open: {tab}.",
  "lang.set": "Language: {name}.",
  "instr.title": "Instructions",
  "instr.1": "Tap <b>▶</b> to record and <b>■</b> to stop.",
  "instr.2": "The first time, the app asks before downloading the models (about 1.3 GB for the five recommended). Only the first time is slow.",
  "instr.3": "The browser will ask for the <b>microphone</b> and may ask whether the site may <b>store data permanently</b>: allow both. The data are the models, not your recordings; without it the browser may delete them and they will be downloaded again.",
  "instr.4": "In the result, <b>tap the symbols</b> to hear each sound.",
  "instr.5": "Models, sources and detailed help: the <b>☰</b> button at the top.",
  "rec.title": "Record", "rec.start": "Record", "rec.stop": "Stop", "rec.file": "Choose an audio file",
  "rec.recording": "Recording… tap ■ to stop.", "rec.stopped": "Recording stopped.", "rec.label": "Recording",
  busy: "Wait: still transcribing.",
  "mic.title": "Microphone", "mic.allow": "Allow microphone", "mic.note": "The microphone is on only while you record.",
  "mic.st.granted": "Allowed.", "mic.st.prompt": "Not allowed yet.", "mic.st.denied": "Blocked.",
  "mic.denied": "Microphone not allowed ({err}). See how to allow it in ☰ → Options.",
  "mic.ok": "Microphone allowed. It turns on only while you record.",
  "mic.blocked": "The browser blocked the microphone. To allow it: tap the icon next to the site address → Permissions (or Site settings) → Microphone → Allow. On iPhone: Settings → Safari → Microphone. Then reload the page.",
  "audio.bad": "Could not read this audio ({err}).", "audio.got": "{s} of audio. Transcribing…",
  "audio.silent": "The recording ({s}) seems silent: the microphone picked up almost nothing. Try again, closer to the microphone.",
  "store.bad": "The recording could not be kept in the browser ({err}).", "store.readBad": "Could not read the saved recordings ({err}).",
  "file.chosen": "File chosen: {name}.",
  "opt.lang": "Language", "opt.models": "Models",
  "opt.modelsNote": "We recommend the first five. The others come from the same paper; see Help for why these five and when to swap. PER and PFER: errors on the reference set (lower is better).",
  "opt.recommended": "Recommended", "opt.others": "Other models from the paper",
  "opt.total": "{n} model(s) selected, {size} in total.",
  "opt.heavy": "Many models together may crash the browser on weaker devices. Running one at a time is safer.",
  "opt.how": "How to run", "opt.seq": "One at a time (recommended)", "opt.all": "All at once",
  "opt.seqMsg": "Mode: one at a time.", "opt.allMsg": "Mode: all at once.",
  "opt.advanced": "Advanced", "opt.backend": "Processing",
  "opt.onMsg": "On: {what}.", "opt.offMsg": "Off: {what}.",
  "model.soon": "not converted yet", "model.cached": "downloaded", "model.toDownload": "{size} to download",
  "model.delete": "delete", "model.deleted": "{name} deleted from the browser ({size} freed).",
  "model.on": "{name} selected.", "model.off": "{name} deselected.",
  "dl.title": "Download the models?",
  "dl.text": "The models below will be downloaded to your device to process the audio. You can delete them later in ☰ → Options, where you can also choose other models and which to download (at least one is needed to see results).",
  "dl.persist": "If the browser asks whether the site may store data permanently, allow it: it means these models.",
  "dl.yes": "Download and transcribe", "dl.no": "Not now", "dl.total": "Total",
  "dl.declined": "Nothing was downloaded. The recording is kept; use \"Redo from scratch\" when you want.",
  "run.none": "No model selected. Select at least one in ☰ → Options.",
  "run.allDone": "The selected models already ran on this recording. To run them again, use \"Redo from scratch\".",
  "run.loading": "Preparing {name} ({step})…", "run.downloading": "Downloading {name} ({step}): {got} of {size} MB",
  "run.transcribing": "Transcribing with {name} ({step})…",
  "run.loaded": "{name}: {how}, ready in {s}.", "run.fromCache": "read from the device", "run.downloaded": "downloaded",
  "run.notStored": "Did not fit in the browser's storage: it will be downloaded again next time.",
  "run.done": "Done: {n} model(s) ran.",
  "run.error": "ERROR: {err}. If the browser crashed, try \"One at a time\" or fewer models.",
  "res.title": "Result", "res.tap": "👆 Tap the symbols to hear each sound",
  "res.wide": "Same width for every symbol", "res.align": "Align in columns",
  "res.edit": "Edit consensus", "res.play": "Play recording", "res.redo": "Redo from scratch",
  "res.redoing": "Redoing from scratch: every selected model runs again on this recording.",
  "res.runMissing": "Also run: {names}",
  "res.export": "Export (.zip)", "res.share": "Share (e.g. Google Drive)",
  "res.zip": "The .zip holds a folder with the audio (WAV), each model's transcription, the consensus and your edit (TXT), timings and alternatives (JSON) and a TextGrid for Praat.",
  "res.consensus": "Consensus", "res.nothing": "(nothing recognised)",
  "res.none": "No model has run on this recording yet. Tap \"Redo from scratch\".",
  "res.working": "Transcribing…",
  "res.few": "With fewer than 3 models the consensus means little.",
  "res.flagged": "{n} of {of} consensus symbol(s) without a majority (highlighted). · = the model heard nothing there.",
  "res.empty": "No result: {names} (the recording may be too short or too quiet).",
  "alt.nothing": "nothing", "alt.majority": "Majority.", "alt.noMajority": "No majority.",
  "play.all": "Playing the recording.", "play.part": "Playing {a}–{b} s.",
  "play.silent": "Playing the recording, but it is silent: the microphone picked up no sound.",
  "play.noTime": "This symbol has no timing (WhIPA does not mark it); tap the same column in another model.",
  "ed.hint": "Tap a symbol to select it, then choose what to do.",
  "ed.left": "← Insert left", "ed.swap": "Swap symbol", "ed.right": "Insert right →",
  "ed.mark": "Add diacritic", "ed.del": "Delete symbol",
  "ed.save": "Save edit", "ed.cancel": "Cancel", "ed.reset": "Back to consensus",
  "ed.opened": "Editor open with the consensus.", "ed.empty": "(empty: use \"Insert right\")",
  "ed.pick": "Select a symbol first.", "ed.changed": "{a} → {b}", "ed.deleted": "Symbol deleted.",
  "ed.saved": "Edit saved; it goes into the export.", "ed.cancelled": "Edit cancelled.",
  "ed.resetDone": "Edit discarded; the consensus stands.", "ed.yours": "Your edit",
  "pk.title": "Choose the kind of symbol",
  "pk.for.left": "Insert left: kind of symbol", "pk.for.right": "Insert right: kind of symbol",
  "pk.for.swap": "Swap for: kind of symbol", "pk.for.mark": "Add to the symbol: kind of mark",
  "pk.vowels": "Vowels", "pk.pulmonic": "Consonants (pulmonic)", "pk.nonpulmonic": "Consonants (non-pulmonic)",
  "pk.other": "Other symbols", "pk.diacritics": "Diacritics", "pk.suprasegmentals": "Suprasegmentals",
  "pk.tones": "Tones and word accents",
  "pk.vowelNote": "As on the IPA chart: where symbols appear in pairs, the one to the right is rounded.",
  "pk.consNote": "As on the IPA chart (2020 revision): in each cell, the voiced one is on the right. Shaded cells: articulations judged impossible. Scroll sideways to see every column.",
  "pk.v.h0": "close", "pk.v.h1": "near-close", "pk.v.h2": "close-mid", "pk.v.h3": "mid", "pk.v.h4": "open-mid",
  "pk.v.h5": "near-open", "pk.v.h6": "open",
  "pk.v.b0": "front", "pk.v.b1": "near-front", "pk.v.b2": "central", "pk.v.b3": "near-back", "pk.v.b4": "back",
  "pk.v.r": "rounded", "pk.v.u": "unrounded",
  "exp.nothing": "Nothing to export: run at least one model.", "exp.saved": "Exported: {name}.",
  "exp.cancelled": "Export cancelled.", "exp.noPicker": "\"Save as\" window unavailable ({err}); downloading the file.",
  "exp.downloading": "Downloading {name}. The browser may ask where to save it.",
  "exp.shared": "Shared.", "exp.shareCancelled": "Sharing cancelled.", "exp.shareFailed": "Could not share ({err}).",
  "recs.title": "Recordings", "recs.none": "No recordings yet.", "recs.noIpa": "(no transcription)",
  "recs.open": "Open", "recs.delete": "Delete", "recs.opened": "Recording opened.",
  "recs.confirmDelete": "Delete this recording from the browser?", "recs.deleted": "Recording deleted.",
  "recs.folder": "Import folder", "recs.zips": "Import .zip",
  "recs.importHint": "Choose the folder where you keep your exports (or the .zip files themselves): the recordings come back to the list with their transcriptions.",
  "imp.none": "No .zip, .wav or .json found.", "imp.reading": "Reading {n} file(s)…",
  "imp.failed": "Could not import ({err}).", "imp.done": "Imported: {added}. Already in the list: {skipped}.",
  "log.title": "Log (what the app did)",
  ready: "Ready ({threads} thread(s)).",
  "help.html": `
<h3>Step by step</h3>
<ol>
  <li>Tap <b>▶</b>. The first time, the browser asks for the microphone: allow it. The microphone is on only while you record.</li>
  <li>Wait half a second and speak. Tap <b>■</b> to stop.</li>
  <li>On the first transcription the app shows which models it will download and how much space they take. Accept to go on.
    If the browser asks whether the site may <b>store data permanently</b>, allow it: that is the models. Then only the first time is slow.</li>
  <li>The bar shows what is happening: which model is downloading (MB) or transcribing.</li>
  <li>In the result each row is one model; the last row is the <b>consensus</b>.</li>
</ol>
<h3>Reading the result</h3>
<ul>
  <li>Symbols are aligned in columns: the same sound sits in the same column. <b>·</b> means that model heard nothing there.</li>
  <li>Highlighted in orange: no majority. These symbols are wrong more than twice as often as the others: check them by ear.</li>
  <li>Tap a symbol to <b>hear that stretch</b> of your recording and see who voted for what.</li>
  <li>"Same width" makes every symbol as wide as an m, easier to tap. "Align in columns" can be turned off to read each row as running text.</li>
</ul>
<h3>Editing the consensus</h3>
<ul>
  <li>"Edit consensus" opens the transcription. Tap a symbol and choose: insert left, swap, insert right, add a diacritic or delete.</li>
  <li>First you choose the kind (vowels, consonants, diacritics…); each kind is laid out as on the IPA chart.</li>
  <li>"Save edit" keeps your version, which goes into the export; the original consensus stays too.</li>
</ul>
<h3>Recordings, export and import</h3>
<ul>
  <li>Recordings stay in the browser. "Redo from scratch" runs every selected model again on that recording.</li>
  <li>"Export" makes a .zip with one folder inside: WAV audio, text, JSON (timings and alternatives) and a TextGrid for Praat.</li>
  <li>To bring them back: "Import folder" (choose the folder where you keep your exports) or "Import .zip".</li>
</ul>
<h3>Length</h3>
<ul>
  <li>There is no technical minimum, but below ~0.5 s of speech the models rarely recognise anything. A short word works; leave a breath before and after.</li>
  <li>Maximum: WhIPA hears only the first 30 s. The others take more, but long recordings weigh on memory; keep to phrases of up to 30 s.</li>
  <li>If a model shows "(nothing recognised)", play the recording: if it is silent, the microphone picked up no sound.</li>
</ul>
<h3>The models: why these five</h3>
<ul>
  <li>The five recommended are the paper's best on the reference set (VoxAngeles, 95 languages) that fit in a browser, and they differ from each other:
    different architectures and training data make mistakes in different places, so when they agree it means something.
    On 760 recordings the consensus gets 47.1% of phones wrong against 49.4% for the best single model; symbols with a majority are right 69% of the time, highlighted ones only 27%.</li>
  <li><b>Wav2Vec2Phoneme</b> is the second best on its own (PER 53.0), but it learned from dictionary pronunciations (eSpeak): it leans towards the "textbook" pronunciation, which this app wants to avoid. It would replace WhIPA if you accept that. Not converted yet.</li>
  <li><b>LoWhIPA comb</b> is better than WhIPA base (77.8 vs 83.7) at the same size: a candidate to replace WhIPA. Not converted yet.</li>
  <li><b>ZIPA large</b> is available, but on the reference set it did worse than small ZIPA (69.1 vs 64.2) and is 4 times bigger: only as an extra vote.</li>
  <li><b>Allophant</b> (71.0) and <b>Allosaurus</b> (91.7, from 2020) are mostly for comparison. <b>WhIPA large</b> (69.4) has 1.5 billion parameters: too big for a browser.</li>
  <li>Have the space? Select everything. The majority is always "more than half of the models that ran"; with an even number of models, ties are highlighted. Swaps not yet measured in the consensus.</li>
</ul>
<h3>Space and cache</h3>
<ul>
  <li>The models are kept in the browser. "Delete" in ☰ → Options frees the space; clearing the browser's data deletes them too, and they will be downloaded again.</li>
</ul>
<h3>Source code and offline use</h3>
<p>Source code and how to run it on your own computer: <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "The paper behind the app",
  "src.paperText": "The models were chosen with the results of",
  "src.models": "Models", "src.model": "model", "src.copy": "converted copy", "src.license": "licence",
  "src.data": "Data and tools",
  "src.nc": "Non-commercial use: two of the models are CC BY-NC-SA 4.0.",
  "src.code": "Source code",
  "instr.6": "Speak at a normal pace, not too fast; recordings longer than 1 second work better.",
  "run.reading": "Reading {name} from the device ({step})…",
  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",
  "theme.light": "Light theme.",
  "theme.dark": "Dark theme.",
  "res.wrap": "Allow line breaks",
  "res.scroll": "Scroll the transcription sideways",
  "recs.exportAll": "Export all (.zip)",
  "exp.packing": "Packing {n} recording(s) into one .zip, each in its own folder…",
  "recs.rename": "Rename",
  "recs.renamePrompt": "Name for this recording (empty = no name; used for the exported file names):",
  "recs.renameCancelled": "Rename cancelled.",
  "recs.renamed": "Renamed: {name}.",
  "recs.unnamed": "Name removed; files use the transcription.",
  "recs.nameHint": "Exported files are named from the list: date, length and transcription. Some programs garble IPA symbols in file names; use \"Rename\" to give a plain name, which replaces the transcription in the file name (the contents stay the same).",
};
