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

## POWSM: CTC head instead of the decoder

POWSM is a joint CTC/attention model. Decoding with **only its CTC head** (encoder
→ `ctc_lo` → greedy) needs no language prompt, cannot loop, and is better on gold:

| POWSM decoding (760 subset) | PER | PFER |
|---|---|---|
| attention decoder, `<unk>` language (as M0 above) | 56.2 | 17.6 |
| **CTC head only** | **53.2** | **14.7** |
| CTC head, ONNX int8 (214 MB) | 53.9 | 15.1 |

Vote with POWSM-CTC (PhoneticXeus, POWSM-CTC, ZIPA, MultIPA, WhIPA): **PER 46.1 /
PFER 13.6**; 79% of phones agreed; agreed right 69.6%, flagged 29.8%. The browser
runs POWSM's front end (STFT → log-mel → global MVN) in JS (`computeLogmel`,
checked against ESPnet fixtures) and the encoder+CTC as ONNX
(`eval/export_powsm_onnx.py`, published as allan-valin/powsm-ctc-onnx).

## Browser app vs Python (95 clips, one per language)

The M1 app's engine (`web/app/engine.js`) in headless Chromium, int8 models loaded
from Hugging Face, vs Python onnxruntime on the same int8 files:

| Model | Browser PER / PFER | Python int8 PER / PFER |
|---|---|---|
| PhoneticXeus | 41.4 / 11.5 | 41.3 / 11.0 |
| MultIPA | 52.2 / 11.2 | 52.1 / 11.2 |
| ZIPA | 48.4 / 14.3 | 54.7 / 14.5 |
| POWSM-CTC | 43.9 / 11.0 | 43.4 / 10.7 |
| WhIPA (fp32, greedy) | 74.7 / 26.1 | 74.7 / 26.1 (= PyTorch greedy) |

Speed per ~1 s clip (WASM, laptop): PhoneticXeus 3.0 s, MultIPA 1.8 s, POWSM 1.4 s, ZIPA 0.07 s,
WhIPA 5.3 s (decoder re-run per token, no KV cache).

- The browser must decode audio in a 16 kHz context: decoding at the default 48 kHz
  and resampling back changed MultIPA's output (`ʃøyjd` → `ʃeyd`).
- **ZIPA's gap is a scoring artefact in the harness, not the browser.** ZIPA emits
  diacritics and length as separate tokens (`t ̪`, `a ː`); the harness keeps the
  spaces, so `evaluate.py` scores each mark as an extra phone. Joining them: ZIPA
  narrow PER 62.1 → **59.1** on the 760 subset (PFER and broad unchanged). The
  paper's ZIPA rows (64.2 small / 69.1 large) are likely ~3 points too high for the
  same reason — to check in phonetic-eval. The app attaches such tokens to the
  previous phone (`web/app/ctc.js`).

## WASM threads (cross-origin isolation)

GitHub Pages cannot send COOP/COEP, so the app vendors coi-serviceworker (MIT),
which adds them; the page reloads once, then WASM runs threaded. Laptop, 10 clips,
PhoneticXeus: 2.98 → 2.35 s per clip in a controlled test. On the live site, one 1 s
clip, all five models: PhoneticXeus 4.8 → 2.0 s, POWSM 1.2 → 0.6 s, MultIPA 1.7 →
0.5 s, WhIPA 3.8 → 1.1 s (fp16 too); ~11.5 s → 4.6 s of transcription in total. Model
downloads from Hugging Face work under COEP (CORS responses).

## WhIPA

- Greedy decoding capped at 20 phones/s beats the harness's beam search + fallback
  ladder: PER 79.3 / PFER 25.6 vs 86.0 / 28.5 (760 subset).
- Exported as encoder + decoder ONNX (`eval/export_whipa_onnx.py`; the decoder needs
  the torch.export exporter and an explicit `positions` input). **Kept fp32**: int8
  shifted the greedy output (95 clips: int8 decoder 84.0 vs fp32 74.7), and
  onnxruntime-web's int8 kernels shift it differently from desktop onnxruntime.
  fp32 in the browser reproduces PyTorch exactly (291 MB). **Shipped as fp16** (146 MB,
  weights only; I/O stays float32): identical to fp32 on 94 of 95 clips, in Python and
  in the browser, at the same speed.
- WhIPA gives whole strings, so its phones carry no timing (`segmentIpa` splits them).

## The vote as the app runs it

PhoneticXeus int8, POWSM-CTC int8, ZIPA int8 (tokens joined), MultIPA int8, WhIPA
fp32 greedy, on the 760 subset: **PER 47.1 / PFER 14.4** (PhoneticXeus int8 alone
49.4 / 14.6). 79.6% of phones agreed; agreed right **69.1%**, flagged **27.1%**.
All five models ≈ 1.33 GB (WhIPA fp16).

## Still open in M0

- (done) WhIPA: see below.
- Real-browser timing: Redmi Chrome (via `adb reverse`), desktop Chrome/Firefox
  with a GPU, iPhone if available.

## Reproduce

Work dir `m0work/` (gitignored): phonetic-eval scripts, VoxAngeles, one env per
model stack (hf, allophant, powsm), subset built from `build_full.py` output.
Scripts in `eval/`: `vote.py` (+ tests), `run_vote.py`, `export_pxeus_onnx.py`,
`run_onnx_ctc.py`.
