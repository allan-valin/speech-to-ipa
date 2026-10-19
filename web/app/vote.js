// Per-symbol vote across models (port of eval/vote.py, scored on gold in M0).
// Hypotheses are aligned one by one onto a growing list of slots; a slot's symbol
// wins when a majority of the models that ran agree. Without a majority the
// backbone model's symbol is kept and the slot is flagged.

const symOf = x => (typeof x === "string" ? x : x.sym);

export function align(hyps, order) {
  let slots = [];
  for (const model of order) {
    const seq = hyps[model] || [];
    if (!slots.length) { slots = seq.map(s => ({ [model]: s })); continue; }
    const n = slots.length, m = seq.length;
    const has = slots.map(sl => new Set(Object.values(sl).filter(Boolean).map(symOf)));
    const cost = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i && j ? 0 : i + j)));
    const sub = (i, j) => (has[i - 1].has(symOf(seq[j - 1])) ? 0 : 1);
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

export function vote(slots, models, backbone) {
  const need = Math.floor(models.length / 2) + 1;
  const out = [];
  for (const slot of slots) {
    const groups = {};
    for (const model of models) {
      const s = slot[model] ? symOf(slot[model]) : "";
      (groups[s] ||= []).push(model);
    }
    const best = Object.keys(groups).reduce((a, b) => (groups[b].length > groups[a].length ? b : a));
    let sym, agreed;
    if (groups[best].length >= need) { sym = best; agreed = true; }
    else { sym = slot[backbone] ? symOf(slot[backbone]) : ""; agreed = false; }
    if (!sym) continue;
    const alternatives = Object.fromEntries(Object.entries(groups).filter(([s]) => s));
    // timing: from the first model (in `models` order) that voted for the winner
    const src = models.map(m => slot[m]).find(x => x && typeof x === "object" && x.sym === sym);
    out.push({ sym, agreed, alternatives, slot, ...(src ? { start: src.start, end: src.end } : {}) });
  }
  return out;
}
