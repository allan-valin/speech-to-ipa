# speech-to-ipa

**Open it:** https://allan-valin.github.io/speech-to-ipa/

Record a word in any language and get a narrow IPA transcription of what was
actually said — not what a dictionary says should have been said.

Everything runs in the browser, on the device: no server, no language setting, no
grapheme-to-phoneme step. Five phone recognizers transcribe the same recording and
vote; symbols without a majority are highlighted, and every model's reading stays
visible. Tap a symbol to hear that slice of your own recording. Export a zip with
the WAV, each model's IPA and the consensus, timings and alternatives (JSON) and a
Praat TextGrid. The interface is in Brazilian Portuguese.

| Model | Runs as | Size | Licence |
|---|---|---|---|
| [PhoneticXeus](https://huggingface.co/changelinglab/PhoneticXeus) | CTC, int8 ([copy](https://huggingface.co/allan-valin/phoneticxeus-onnx)) | 582 MB | CC BY-NC-SA 4.0 |
| [POWSM](https://huggingface.co/espnet/powsm) | encoder + CTC head, int8 ([copy](https://huggingface.co/allan-valin/powsm-ctc-onnx)) | 214 MB | CC BY 4.0 |
| [ZIPA small](https://huggingface.co/anyspeech/zipa-small-crctc-ns-700k) | CTC, the authors' int8 | 71 MB | CC BY-NC-SA 4.0 |
| [MultIPA](https://huggingface.co/ctaguchi/wav2vec2-large-xlsr-japlmthufielta-ipa1000-ns) | CTC, int8 ([copy](https://huggingface.co/allan-valin/multipa-onnx)) | 318 MB | MIT |
| [WhIPA base](https://huggingface.co/jshrdt/whipa-base-cv) | Whisper, greedy, fp32 ([copy](https://huggingface.co/allan-valin/whipa-base-onnx)) | 291 MB | Apache 2.0 |

Models were chosen on a gold benchmark (VoxAngeles, 95 languages) from
[phonetic-eval](https://github.com/allan-valin/phonetic-eval). On 760 gold
utterances (8 per language) the vote scores PER 47.1 / PFER 14.4, against 49.4 /
14.6 for the best single model; phones the models agree on are right 69% of the
time, highlighted ones 27%. Details: [docs/M0-RESULTS.md](docs/M0-RESULTS.md).

Non-commercial: two of the models are licensed CC BY-NC-SA 4.0.

## Layout

- `web/app/` — the app (plain ES modules, onnxruntime-web from a CDN; no build step)
- `eval/` — export scripts for the ONNX copies, the vote in Python, scoring helpers
- `tests/` — `npm test` (node:test): front ends checked against the Python
  originals, CTC decoding, vote, export; `python -m pytest eval/` for the Python vote
- `docs/` — design and M0 results
