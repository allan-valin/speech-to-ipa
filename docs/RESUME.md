# Resume here

State on 2026-10-19, end of the evening session.

## What exists

- **Live app**: https://allan-valin.github.io/speech-to-ipa/ (`web/app/`, GitHub
  Pages from `main`, root `index.html` redirects). All five voters run in the
  browser; models load from Hugging Face (`allan-valin/{phoneticxeus,multipa,
  powsm-ctc,whipa-base}-onnx`, ZIPA straight from `anyspeech/`).
- M1 (shell: mic button, first-load notice, model checkboxes + sizes + crash
  warning, one-at-a-time / all-at-once, recordings in IndexedDB, re-run on an old
  recording, per-model delete from cache, log line per action), M2 (vote,
  Consenso / per-model / Todos views, tap-to-play slices, alternatives) and M3
  (zip export: WAV, TXT, JSON, TextGrid; save-as / download / share) are built.
- Portfolio card (en/pt/de) with image in allan-valin.github.io (Tools section).
- `web/spike/` is the M0 speed page (PhoneticXeus only); kept for timing tests.

## Verified

- `npm test` (27 node tests) and `python -m pytest eval/` (7) pass.
- Every front end ported to JS is checked against the Python original with fixtures
  (ZIPA fbank, POWSM log-mel, Whisper log-mel); the JS vote equals `eval/vote.py`
  on all 760 subset files.
- Headless Chromium on the live site: all five models download, transcribe, vote,
  show alternatives, export a zip that `unzip -t` and praatio accept. Browser output
  vs Python on 95 clips: see docs/M0-RESULTS.md.

## Not verified / open

1. **Real phone and real browsers** — nothing has run on Allan's Redmi or an
   iPhone yet; headless had no microphone and a small cache quota (big models showed
   "não coube no cache"). First thing to do with Allan: open the link on the Redmi.
2. WebGPU only tried headless (software adapter, useless).
3. Speed: ~2–5 s per second of audio per big model on the laptop (WhIPA slowest:
   decoder re-run per token). Ideas: KV-cache decoder export, fp16 WhIPA (291 MB now),
   coi-serviceworker for WASM threads on Pages.
4. phonetic-eval harness scores ZIPA's spaced diacritic tokens as separate phones
   (narrow PER ~3 points too high; paper's ZIPA rows likely affected). Allan's call.
5. `m0work/` (gitignored, ~30 GB: envs, corpus, models, results) — delete when M0
   experiments are over; everything needed to rebuild is in `eval/` + the HF copies.
6. Allophant (reserve voter) not exported.
