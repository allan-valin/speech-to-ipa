"""Per-symbol vote across phone-recognizer hypotheses (ROVER-style).

Hypotheses are aligned one by one onto a growing list of slots; each slot maps
model -> symbol ("" = that model has nothing there). A slot's symbol wins when a
majority of the models that ran agree on it. Without a majority the backbone
model's symbol is kept and the slot is flagged, so disagreement stays visible.
"""


def align(hyps, order):
    """Merge hypotheses (model -> list of phones) into slots, in `order`."""
    slots = []
    for model in order:
        seq = hyps.get(model, [])
        if not slots:
            slots = [{model: s} for s in seq]
            continue
        n, m = len(slots), len(seq)
        # cost[i][j]: best cost aligning first i slots with first j symbols
        cost = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            cost[i][0] = i
        for j in range(1, m + 1):
            cost[0][j] = j
        for i in range(1, n + 1):
            syms = set(slots[i - 1].values())
            for j in range(1, m + 1):
                sub = 0 if seq[j - 1] in syms else 1
                cost[i][j] = min(cost[i - 1][j - 1] + sub,
                                 cost[i - 1][j] + 1,    # model skips this slot
                                 cost[i][j - 1] + 1)    # model adds a new slot
        merged, i, j = [], n, m
        while i or j:
            if i and j and cost[i][j] == cost[i - 1][j - 1] + (0 if seq[j - 1] in set(slots[i - 1].values()) else 1):
                merged.append({**slots[i - 1], model: seq[j - 1]}); i -= 1; j -= 1
            elif i and cost[i][j] == cost[i - 1][j] + 1:
                merged.append({**slots[i - 1], model: ""}); i -= 1
            else:
                merged.append({model: seq[j - 1]}); j -= 1
        slots = merged[::-1]
    return slots


def vote(slots, models, backbone):
    """Return consensus phones, an agreed flag per phone, and alternatives."""
    need = len(models) // 2 + 1
    out = {"consensus": [], "agreed": [], "alternatives": []}
    for slot in slots:
        counts = {}
        for model in models:
            counts.setdefault(slot.get(model, ""), []).append(model)
        best = max(counts, key=lambda s: len(counts[s]))
        if len(counts[best]) >= need:
            symbol, agreed = best, True
        else:
            symbol, agreed = slot.get(backbone, ""), False
        if not symbol:
            continue
        out["consensus"].append(symbol)
        out["agreed"].append(agreed)
        out["alternatives"].append({s: ms for s, ms in counts.items() if s})
    return out
