// Greedy CTC: argmax per frame, merge repeats, drop the blank and <...>/[...] tokens.
// Each phone keeps its frame span [start, end), which becomes its audio slice.

export function greedyCtc(logits, frames, vocabSize, id2sym, blank) {
  const out = [];
  let prev = -1;
  for (let t = 0; t < frames; t++) {
    let best = -Infinity, id = 0;
    for (let k = 0; k < vocabSize; k++) {
      const x = logits[t * vocabSize + k];
      if (x > best) { best = x; id = k; }
    }
    if (id === prev) {
      if (out.length && out[out.length - 1].id === id) out[out.length - 1].end = t + 1;
      continue;
    }
    prev = id;
    const sym = id2sym[id] || "";
    if (id === blank || !sym.trim() || /^[<[].*[>\]]$/.test(sym) || sym === "▁" || sym === "|") continue;
    out.push({ id, sym, start: t, end: t + 1 });
  }
  return out.map(({ sym, start, end }) => ({ sym, start, end }));
}
