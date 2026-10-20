"""How often are agreed vs flagged consensus phones right? (the highlight's value)

    cd <workdir with scripts/ results/ references.tsv>
    python /path/to/eval/flag_accuracy.py [<result folder>...]      (default: the five recommended)
"""
import csv
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, "scripts")
from evaluate import to_phone_tokens
from run_vote import ORDER
from vote import align, vote


def exact_matches(hyp, ref):
    """For each hyp phone: is it matched to an identical ref phone in a min-edit alignment?"""
    n, m = len(hyp), len(ref)
    d = [[i + j if not i * j else 0 for j in range(m + 1)] for i in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (hyp[i - 1] != ref[j - 1]))
    ok, i, j = [False] * n, n, m
    while i and j:
        if d[i][j] == d[i - 1][j - 1] + (hyp[i - 1] != ref[j - 1]):
            ok[i - 1] = hyp[i - 1] == ref[j - 1]
            i, j = i - 1, j - 1
        elif d[i][j] == d[i - 1][j] + 1:
            i -= 1
        else:
            j -= 1
    return ok


def main(*order):
    order = list(order) or ORDER
    refs = {r["filename"][:-4]: r["reference_ipa"]
            for r in csv.DictReader(open("references.tsv", encoding="utf-8"), delimiter="\t")}
    tally = {True: [0, 0], False: [0, 0]}          # agreed -> [right, total]
    for path in glob.glob(f"results/{order[0]}/*.txt"):
        key = os.path.basename(path)[:-4]
        hyps = {m: to_phone_tokens(open(f"results/{m}/{key}.txt", encoding="utf-8").read()).split()
                for m in order}
        out = vote(align(hyps, order), models=order, backbone=order[0])
        for right, agreed in zip(exact_matches(out["consensus"], to_phone_tokens(refs[key]).split()),
                                 out["agreed"]):
            tally[agreed][0] += right
            tally[agreed][1] += 1
    for agreed, (right, total) in tally.items():
        print(f"{'agreed' if agreed else 'flagged'}: {100 * right / total:.1f}% right (n={total})")


if __name__ == "__main__":
    main(*sys.argv[1:])
