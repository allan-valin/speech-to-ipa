# Resume here

State on 2026-10-20 (after Allan's first phone test; it ran on the Redmi).

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

- 2026-10-20 feedback batch built and checked live (35 headless assertions,
  scratchpad `ui2.cjs`): ☰ menu (Opções/Fontes/Ajuda), 8 interface languages with
  flags, ▶/■, mic per take, download confirmation, labelled progress, one aligned
  grid view, consensus editor with IPA chart picker, zip folder + import, ZIPA large.
  Ledger: docs/FEEDBACK-2026-10-20.md (only M1 open).

## Verified

- `npm test` (27 node tests) and `python -m pytest eval/` (7) pass.
- Every front end ported to JS is checked against the Python original with fixtures
  (ZIPA fbank, POWSM log-mel, Whisper log-mel); the JS vote equals `eval/vote.py`
  on all 760 subset files.
- Headless Chromium on the live site: all five models download, transcribe, vote,
  show alternatives, export a zip that `unzip -t` and praatio accept. Browser output
  vs Python on 95 clips: see docs/M0-RESULTS.md.

## Not verified / open

0. **M1**: convert Wav2Vec2Phoneme, LoWhIPA comb, Allophant, Allosaurus (needs a new
   HF write token from Allan; the old one was revoked 2026-10-20 and deleted locally).
   Then measure swaps in the vote on the 760 subset before recommending any.
0b. de/ja/fr/it/sv/el strings are machine translations: native check wanted.
1. **Real phone and real browsers** — ran on Allan's Redmi 2026-10-19 (Chrome);
   new UI not yet seen on the phone. No iPhone yet. Headless covered the mic path only with Chromium's fake microphone
   (record → WebM/Opus → 16 kHz → models works), and had a small cache quota (big
   models showed "não coube no cache"). First thing with Allan: the link on the Redmi.
2. WebGPU only tried headless (software adapter, useless).
3. Speed: with WASM threads (coi-serviceworker, live since 2026-10-19) all five models
   take ~4.6 s for a 1 s clip on the laptop; phones unknown. Next idea: KV-cache
   decoder for WhIPA (would save ~half of WhIPA's time, ~15% of a full run).
4. phonetic-eval harness scores ZIPA's spaced diacritic tokens as separate phones
   (narrow PER ~3 points too high; paper's ZIPA rows likely affected). Allan's call.
5. `m0work/` (gitignored, ~30 GB: envs, corpus, models, results) — delete when M0
   experiments are over; everything needed to rebuild is in `eval/` + the HF copies.
6. Allophant (reserve voter) not exported.
