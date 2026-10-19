"""Vote over each model's hypotheses and write the consensus as another "model".

    cd <workdir with scripts/ results/ references.tsv>
    python /path/to/eval/run_vote.py

Writes results/vote5/*.txt (backbone = PhoneticXeus) for scripts/evaluate.py to
score next to the single models, and prints how many phones were agreed.
"""
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, "scripts")
from evaluate import to_phone_tokens  # same segmentation the scorer uses
from vote import align, vote

ORDER = ["phoneticxeus", "powsm", "zipa", "allophant", "whipa"]


def main():
    files = sorted(os.path.basename(p) for p in glob.glob(f"results/{ORDER[0]}/*.txt"))
    outdir = "results/vote5"
    os.makedirs(outdir, exist_ok=True)
    agreed = total = 0
    for name in files:
        hyps = {}
        for model in ORDER:
            with open(f"results/{model}/{name}", encoding="utf-8") as f:
                hyps[model] = to_phone_tokens(f.read()).split()
        out = vote(align(hyps, ORDER), models=ORDER, backbone=ORDER[0])
        agreed += sum(out["agreed"])
        total += len(out["agreed"])
        with open(f"{outdir}/{name}", "w", encoding="utf-8") as f:
            f.write(" ".join(out["consensus"]) + "\n")
    print(f"{len(files)} files, {agreed}/{total} phones agreed ({100 * agreed / max(total, 1):.1f}%)")


if __name__ == "__main__":
    main()
