// Per-symbol vote across models (port of eval/vote.py, scored on gold in M0).
// Hypotheses are aligned one by one onto a growing list of slots; a slot's symbol
// wins when a majority of the models that ran agree. Without a majority the
// backbone model's symbol is kept and the slot is flagged.

const symOf = x => (typeof x === "string" ? x : x.sym);

// `byTime`: among equally good alignments prefer pairing phones that are close in
// time (a penalty far below 1, so the number of edits never changes).
export function align(hyps, order, byTime = false) {
  let slots = [];
  for (const model of order) {
    const seq = hyps[model] || [];
    if (!slots.length) { slots = seq.map(s => ({ [model]: s })); continue; }
    const n = slots.length, m = seq.length;
    const has = slots.map(sl => new Set(Object.values(sl).filter(Boolean).map(symOf)));
    const cost = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i && j ? 0 : i + j)));
    const at = slots.map(sl => {
      const t = Object.values(sl).filter(x => x && x.start !== undefined).map(x => x.start);
      return t.length ? t.reduce((a, b) => a + b, 0) / t.length : null;
    });
    const near = (i, j) => (byTime && at[i - 1] !== null && seq[j - 1]?.start !== undefined
      ? Math.min(Math.abs(at[i - 1] - seq[j - 1].start), 10) * 1e-4 : 0);
    const sub = (i, j) => (has[i - 1].has(symOf(seq[j - 1])) ? 0 : 1) + near(i, j);
    for (let i = 1; i <= n; i++)
      for (let j = 1; j <= m; j++)
        cost[i][j] = Math.min(cost[i - 1][j - 1] + sub(i, j), cost[i - 1][j] + 1, cost[i][j - 1] + 1);
    const merged = [];
    let i = n, j = m;
    while (i || j) {
      if (i && j && cost[i][j] === cost[i - 1][j - 1] + sub(i, j)) { merged.push({ ...slots[i - 1], [model]: seq[j - 1] }); i--; j--; }
      else if (i && cost[i][j] === cost[i - 1][j] + 1) { merged.push({ ...slots[i - 1], [model]: null }); i--; }
      else { merged.push({ [model]: seq[j - 1] }); j--; }
    }
    slots = merged.reverse();
  }
  return slots;
}

/** One slot's decision; `sym` is "" when the majority (or the backbone) heard nothing. */
export function decide(slot, models, backbone) {
  const need = Math.floor(models.length / 2) + 1;
  const groups = {};
  for (const model of models) {
    const s = slot[model] ? symOf(slot[model]) : "";
    (groups[s] ||= []).push(model);
  }
  const best = Object.keys(groups).reduce((a, b) => (groups[b].length > groups[a].length ? b : a));
  let sym, agreed;
  if (groups[best].length >= need) { sym = best; agreed = true; }
  else { sym = slot[backbone] ? symOf(slot[backbone]) : ""; agreed = false; }
  const alternatives = Object.fromEntries(Object.entries(groups).filter(([s]) => s));
  // timing: from the first model (in `models` order) that voted for the winner
  const src = models.map(m => slot[m]).find(x => x && typeof x === "object" && x.sym === sym);
  return { sym, agreed, alternatives, slot, ...(src ? { start: src.start, end: src.end } : {}) };
}

export function vote(slots, models, backbone) {
  return slots.map(slot => decide(slot, models, backbone)).filter(d => d.sym);
}

/** Columns for the side-by-side view: every model's phone (or null) and the column's decision. */
export function grid(results, models) {
  return align(results, models, true).map(slot => ({
    cells: Object.fromEntries(models.map(m => [m, slot[m] || null])),
    cons: decide(slot, models, models[0]),
  }));
}
