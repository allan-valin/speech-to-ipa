# speech-to-ipa

Record speech in any language and get a narrow IPA transcription of what was
actually said — not what a dictionary says should have been said.

Runs entirely in the browser, on the device: no server, no language setting, no
grapheme-to-phoneme step. Five phone recognizers transcribe the same recording and
vote; symbols they disagree on are highlighted, and every model's reading stays
visible. Tap a symbol to hear that slice of your own recording.

**Status:** design only. See
[`docs/superpowers/specs/2026-10-19-speech-to-ipa-design.md`](docs/superpowers/specs/2026-10-19-speech-to-ipa-design.md).

Model choice rests on a gold benchmark (VoxAngeles, 95 languages) from
[phonetic-eval](https://github.com/allan-valin/phonetic-eval).

Non-commercial: two of the models are licensed CC-BY-NC-SA-4.0.
