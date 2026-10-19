# M0 results (2026-10-19)

All numbers: gold VoxAngeles references, scored with phonetic-eval's `evaluate.py`
(narrow; broad in the last two columns), on a **760-file subset: 8 utterances from
each of the 95 languages** (all 21 families). The subset reads 2–3 PER points easier
than the full 5,416 set (PhoneticXeus 48.9 vs 51.9, ZIPA 62.1 vs 64.2); rankings hold.
Use it for comparisons between rows, not as absolute numbers.

## Single models, vote, int8

| Run | PER | PFER | PER broad | PFER broad |
|---|---|---|---|---|
| **vote5** (PhoneticXeus, POWSM, ZIPA, MultIPA, WhIPA) | **47.0** | **13.7** | 38.5 | 13.2 |
| vote5 with Allophant instead of MultIPA | 46.8 | 13.8 | 38.3 | 13.3 |
| PhoneticXeus (PyTorch) | 48.9 | 14.0 | 40.2 | 13.5 |
| PhoneticXeus ONNX fp32 | 48.9 | 14.0 | 40.2 | 13.5 |
| PhoneticXeus ONNX **int8** (582 MB) | 49.4 | 14.6 | 40.6 | 14.3 |
| POWSM (no language hint) | 56.2 | 17.6 | 47.3 | 17.0 |
| ZIPA small (ONNX fp32, 260 MB) | 62.1 | 18.9 | 49.2 | 16.8 |
| ZIPA small ONNX **int8** (official, 71 MB) | 62.4 | 19.0 | 49.4 | 17.0 |
| MultIPA | 61.1 | 14.6 | 48.0 | 14.1 |
| Allophant | 71.5 | 22.2 | 50.1 | 20.4 |
| WhIPA base | 86.0 | 28.5 | 68.8 | 26.8 |

- **int8 is fine**: +0.5 PER / +0.6 PFER for PhoneticXeus, +0.3 PER for ZIPA.
- The ONNX export of PhoneticXeus is exact (fp32 ONNX = PyTorch).

## The vote

With MultIPA (licensed MIT on 2026-10-19) in place of Allophant: 80.5% of phones
agreed; agreed phones right **67.6%**, flagged **29.5%** (`eval/flag_accuracy.py`).
The numbers below were measured first with Allophant.


- PER 46.8 vs 48.9 for PhoneticXeus alone: −2.1 points (4% relative). Small.
- **The highlighting is the real value**: 77% of phones get a majority (≥ 3 of 5).
  Agreed phones are correct **69.1%** of the time; flagged phones **31.4%**. A flag
  marks a symbol that is more than twice as likely to be wrong.
- Variants are within 0.6 points of each other (top-3 only 47.4; four models 47.2;
  merge order changed 46.9). Five stays: it gives 3-of-5 majorities without ties.

## Things found on the way

- **POWSM needs a language hint to behave.** The June harness passed each file's
  ISO code (`<iso>`); the app cannot. With `<unk>` and the default length cap
  (POWSM pads to 30 s, so up to ~750 tokens), one 1-second Sino-Tibetan word decoded
  without end and exhausted GPU memory (and 6 GB RAM on CPU). The last 83 files were
  run with `maxlenratio=0.1` (≤ ~75 tokens); one file came out empty. The app needs
  that cap. Its June full-set 55.5 PER was with the hint; here 56.2 without.
- **Allophant decodes against a fixed phone inventory** (union of 16 languages in
  the harness). That restricts its output — a mild version of the "no language
  setting" rule. To check: a universal inventory option.
- **PhoneticXeus's vocabulary includes narrow units** (`ʎː`, `œ̞`, `o̤`, `kˀ`), so it
  can emit length and diacritics.
- PhoneticXeus export needed one change: its frontend's `F.layer_norm(x, x.shape)`
  cannot be traced with a dynamic length; the same normalisation is done in the
  wrapper (`eval/export_pxeus_onnx.py`).
- Speed on this laptop's CPU (onnxruntime, 760 clips of ~1 s): PhoneticXeus fp32
  2.0 min, int8 4.2 min (dynamic int8 is slower on this CPU — check in the browser).

## Browser (web/spike/)

`web/spike/index.html`: onnxruntime-web 1.30.0, PhoneticXeus int8, mic or file,
greedy CTC in JS. Headless Chromium (Playwright) on this laptop (12 threads):

- **Output identical** to the Python int8 run on the files checked.
- Download 582 MB from localhost 2.8 s; session creation 2.8 s.
- **WASM: ~2 s per 1 s of audio** at steady state, with or without cross-origin
  isolation (threads). Python onnxruntime on the same CPU: ~0.3 s. So the browser
  is ~6× slower here, and a phone will be slower still. Five models one after
  another on a 5 s recording would take on the order of a minute on desktop.
- **WebGPU headless: unusable** (software adapter; garbage output, 16 s). Needs a
  real GPU browser before any conclusion.
- Cache API `put` of the 582 MB model failed in headless (quota); to check in a
  real browser profile.

Ideas to test next: fp16 model on WebGPU (int8 MatMulInteger likely runs slow or
emulated), fp32 on WASM (2.3 GB, too big for phones), coi-serviceworker so GitHub
Pages gets cross-origin isolation.

## Still open in M0

- ONNX export of POWSM (encoder-decoder + beam search), WhIPA (Whisper — optimum
  exports exist for Whisper), Allophant; int8 check for each.
- Real-browser timing: Redmi Chrome (via `adb reverse`), desktop Chrome/Firefox
  with a GPU, iPhone if available.

## Reproduce

Work dir `m0work/` (gitignored): phonetic-eval scripts, VoxAngeles, one env per
model stack (hf, allophant, powsm), subset built from `build_full.py` output.
Scripts in `eval/`: `vote.py` (+ tests), `run_vote.py`, `export_pxeus_onnx.py`,
`run_onnx_ctc.py`.
