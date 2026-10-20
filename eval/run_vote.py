"""Vote over each model's hypotheses and write the consensus as another "model".

    cd <workdir with scripts/ results/ references.tsv>
    python /path/to/eval/run_vote.py [<out name> <result folder>...]

Writes results/<out name>/*.txt (backbone = the first folder; default: vote5 over the
five recommended models) for scripts/evaluate.py to score next to the single
models, and prints how many phones were agreed.
"""
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, "scripts")
from evaluate import to_phone_tokens  # same segmentation the scorer uses
from vote import align, vote

ORDER = ["phoneticxeus", "powsm_ctc", "zipa", "multipa", "whipa"]


def main(name="vote5", *order):
    order = list(order) or ORDER
    files = sorted(os.path.basename(p) for p in glob.glob(f"results/{order[0]}/*.txt"))
    outdir = f"results/{name}"
    os.makedirs(outdir, exist_ok=True)
    agreed = total = 0
    for fname in files:
        hyps = {}
        for model in order:
            with open(f"results/{model}/{fname}", encoding="utf-8") as f:
                hyps[model] = to_phone_tokens(f.read()).split()
        out = vote(align(hyps, order), models=order, backbone=order[0])
        agreed += sum(out["agreed"])
        total += len(out["agreed"])
        with open(f"{outdir}/{fname}", "w", encoding="utf-8") as f:
            f.write(" ".join(out["consensus"]) + "\n")
    print(f"{len(files)} files, {agreed}/{total} phones agreed ({100 * agreed / max(total, 1):.1f}%)")


if __name__ == "__main__":
    main(*sys.argv[1:])
