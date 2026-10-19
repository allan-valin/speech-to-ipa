# Speech-to-IPA (app #3) — design

Date: 2026-10-19. Status: scoped, nothing built. Next: M0.

## Goal

Record speech in any language, get a **narrow IPA transcription** that is what was
said, not what a dictionary says should have been said. Runs entirely on the user's
device, in the browser, on any phone or PC. Non-commercial, open.

## Hard rules

1. **No auto-correct.** No ASR → text → G2P path, no language model, no language
   setting. Only acoustic phone recognizers. (Residual normalisation baked into
   models' G2P training labels cannot be removed — say so in the About text.)
2. **Narrow is the default**, not an option. Models are judged on Allan's **gold**
   VoxAngeles numbers (narrow PER + PFER, both low). Silver/G2P benchmarks reward
   dictionary-likeness and are not used for selection.
3. **On-device only.** No server inference. Audio never leaves the device unless
   the user exports it.
4. **Non-commercial forever** (two models are CC-BY-NC-SA, see Licences).

## Platform: web first

- Static page on GitHub Pages (HTTPS → microphone works). Installable PWA, offline
  after first load.
- Inference: onnxruntime-web (WebGPU where available, WASM fallback).
- Model files on Hugging Face Hub (CORS-enabled, free). Not GitHub Releases (no
  CORS) and not Pages (100 MB per-file limit).
- Native Android (fork of zbor's shell, same ONNX files) is the fallback only if the
  browser is too slow on phones. iPhone native: not planned (needs Mac + paid
  account); the web app covers iPhone.

## Models

Five voters, different bases and/or training data, all chosen on gold numbers
(VoxAngeles, 5,416 utterances, 95 languages, 21 families; Allan's runs, June 2026,
PhoneticXeus added 2026-10-19 with the same harness and references):

| Model | Base | Params | ~int8 size | Gold PER | Gold PFER | Weights licence |
|---|---|---|---|---|---|---|
| PhoneticXeus | XEUS (4k langs) | 575M | ~600 MB | **51.9** | **14.1** | CC-BY-NC-SA-4.0 |
| POWSM | from scratch, IPAPack++ | 350M | ~350 MB | 55.5 | 16.1 | CC-BY-4.0 |
| ZIPA small | Zipformer, IPAPack++ | 64M | ~70 MB | 64.2 | 18.0 | CC-BY-NC-SA-4.0 |
| WhIPA base | Whisper base | 74M | ~75 MB | 83.7 | 27.1 | Apache-2.0 |
| Allophant | XLS-R (128 langs) | 300M | ~320 MB | 71.0 | 20.5 | Apache-2.0 |
| *(MultIPA, pending)* | XLSR-53 | 300M | ~320 MB | 62.4 | 15.0 | **none** |

- MultIPA has no licence (HF card and GitHub) → cannot redistribute. Allophant is the
  stand-in; MultIPA joins if its author adds a licence. Ceiling cost of the swap is
  small: best-of-5 on gold 38.2 / 6.4 (Allophant) vs 37.7 / 6.5 (MultIPA).
- Why these: lowest per-file error correlation with each other (e.g. PhoneticXeus vs
  WhIPA 0.25, vs POWSM 0.36), and together they hold most per-family wins. WhIPA is
  weak alone but disagrees most, which is what a voter needs.
- Excluded: wav2vec2phoneme (phonemic-only output), ZIPA large (copy of small),
  WhIPA large (1550M), Allosaurus (91.7 PER), BranchShine (no public weights; its
  paper is not comparable — IPAPack++ split, CER).
- WhIPA and POWSM decode autoregressively (can hallucinate); fine inside a vote.
- Everything else is CTC: frame posteriors → greedy decode → per-symbol timestamps.

## Voting

- Align all hypotheses (ROVER-style; symbol timestamps anchor the alignment), then
  vote per slot.
- ≥ 3 of 5 agree → consensus symbol. Otherwise → slot **highlighted** as no
  agreement. With fewer models run, majority of those run; 2-2 ties highlighted.
- Alternatives are always available on every slot, agreed or not.
- Expected gain is unknown until M0 measures the real per-symbol vote on gold
  (the 38.2 above is a best-per-file ceiling, not the vote's score).

## Running models

- Checkbox per model, each showing its size. Default: all five ticked; total
  ~1.4 GB, with a warning that weak devices may crash.
- Only ticked models are downloaded.
- Run mode: **one at a time** (default — load, transcribe, unload, next; lowest
  memory) or **all at once** (strong machines).
- Recordings are kept in the browser (IndexedDB), so a model can be added later to
  an old recording and the comparison updates.

## UI

- **Allow microphone** button, always visible until granted; if blocked, short
  instructions for where to change site permissions (Chrome Android, Safari iOS,
  desktop).
- First-load notice: models are large, first download takes a while, and clearing
  browser data deletes them — they will download again.
- Every action answers visibly (log line + busy bar), per Allan's UI rule.
- Result view with switch buttons:
  **[Consensus] [PhoneticXeus] [POWSM] [ZIPA] [WhIPA] [Allophant] [All stacked]**
  - Consensus: disagreements highlighted, tap a slot for alternatives.
  - Single model: its transcription, slots that differ from consensus marked.
  - All stacked: every model's line, time-aligned.
  - Buttons appear only for models run on this recording.
- Tap any symbol/span → plays **that slice of the user's own recording** (from CTC
  timestamps). No TTS read-back: any TTS imposes an accent/normalises.
- Optional later: reference sounds per symbol (e.g. CC IPA-chart recordings),
  labelled "reference, not your speech".

## Export

- Browser "Save as" dialog (File System Access API where supported, else download;
  Web Share API on phones → e.g. Google Drive).
- Bundle (zip): WAV; every model's IPA + the consensus line; JSON with per-symbol
  timestamps, votes and alternatives; Praat TextGrid (one tier per model + consensus);
  ELAN .eaf optional.

## Licences / credits

- CC-BY-NC-SA-4.0 (PhoneticXeus, ZIPA): credit + licence link in an About panel;
  our quantised ONNX copies are adapted material → published under the same licence,
  marked as modified. No monetisation, ever.
- CC-BY-4.0 (POWSM): credit. Apache-2.0 (WhIPA, Allophant): notice.
- App code: open licence compatible with the above (decide in M1).

## Milestones

**M0 — measure before building**
1. Export the five to ONNX, int8; score int8 vs fp32 on gold with the
   phonetic-eval harness (scoring logic reused; env + audio rebuilt in a temp dir
   and deleted after, as on 2026-10-19).
2. Implement the per-symbol vote; score it on gold vs PhoneticXeus alone. If the
   vote does not beat the best single model, the consensus view becomes
   "PhoneticXeus + disagreement markers" instead.
3. Bare web page: one model, record, show IPA. Time it on the Redmi (Chrome),
   desktop, and an iPhone if one is available. Check WebGPU availability and
   Safari memory with one-at-a-time loading.

**M1** — app shell: mic button, recording store, checkboxes, run modes, single-model
views, first-load notice.
**M2** — vote + consensus view + all-stacked + tap-to-play slices.
**M3** — export bundle (save-as / share, TextGrid, JSON), About/credits.
**Later** — practice mode (target word vs said, via robot's `phonetics.py` idea),
reference sounds, MultIPA if licensed.

## Reuse

- zbor: Android fallback shell, mic capture, pack download, ONNX Runtime setup.
- speech-controlled-robot: `phonetics.py` (espeak IPA + edit-distance similarity)
  for the later practice mode.
- phonetic-eval: references, `evaluate.py`, per-file results for all 11 models.

## Open items

- MultIPA licence: issue opened on ctaguchi/multipa 2026-10-19; waiting for the author.
- PhoneticXeus needs `transformers<5` in Python; check its ONNX export in M0.

### Draft issue for ctaguchi/multipa

> **Licence for the code and the released weights?**
> Hi, thanks for MultIPA. I'd like to use
> `ctaguchi/wav2vec2-large-xlsr-japlmthufielta-ipa1000-ns` (converted to ONNX) in a
> free, non-commercial, open-source speech-to-IPA web app, with credit to the paper.
> Neither this repo nor the Hugging Face model card states a licence, so I can't
> redistribute it as is. Would you consider adding one (e.g. Apache-2.0, MIT, or
> CC-BY)? Thank you!
