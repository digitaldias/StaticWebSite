"""Score how much prior knowledge each `## ` section of a blog post asks of its reader.

Asks the local decision model (Ollama /v1/systemone) one question per section and maps
the expected level, 0 to 3, onto Microsoft's 100-400 session scale. Writes the raw score to
src/data/depth.yaml, keyed by post file name, so scoring never touches a post's own commit
history (a post commit would mark it Revised).

Usage: python scripts/depth-score.py <post file name or path> [...]
       python scripts/depth-score.py --all
"""

import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "src" / "content" / "blog"
DATA = ROOT / "src" / "data" / "depth.yaml"
OLLAMA = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
MODEL = os.environ.get("DEPTH_MODEL", "d3:4b-q8_0")
SKIP = {"faq", "common questions", "references"}

# Microsoft's conference session levels (PDC/TechEd, 2008) judge two things: what the
# session assumes the audience already knows, and what its code shows. One question each.
QUESTIONS = {
    "knowledge": {
        "type": "score",
        "instructions": (
            "This is one section of a technology blog post. What does the section assume its "
            "reader already knows about the technology it discusses? Judge what the text assumes, "
            "not how advanced its topic sounds."
        ),
        "criteria": [
            "Nothing. A reader who has never heard of the technology follows it: what it is, why "
            "it matters, where it is heading. Names and numbers are explained in plain words.",
            "The reader has heard of it. The section gives a broad overview of what it can do, "
            "the scenarios it fits and the value it brings.",
            "The reader has used it. The section shows how to implement a solution with it and "
            "how the parts fit together.",
            "The reader builds with it. The section explains internals: how it works and why it "
            "was designed that way, and what those decisions mean in real use.",
        ],
    },
    "code": {
        "type": "score",
        "instructions": "What does the code, command or configuration in this section of a technology blog post do?",
        "criteria": [
            "There is no code, command or configuration.",
            "A short sample makes a point; the reader does not need to run it.",
            "Detailed code or commands the reader runs or adapts to build a working solution.",
            "Code that exposes how a component behaves inside: internals, timing, memory, protocol.",
        ],
    },
}


def sections(text: str) -> list[tuple[str, str]]:
    body = re.split(r"^---\s*$", text, maxsplit=2, flags=re.M)[-1]
    pairs, heading, lines, fenced = [], "(opening)", [], False
    for line in body.splitlines():
        if re.match(r"^\s*(```|~~~)", line):
            fenced = not fenced
        found = None if fenced else re.match(r"^## +(.+)$", line)
        if found:
            pairs.append((heading, "\n".join(lines)))
            heading, lines = found.group(1), []
        else:
            lines.append(line)
    pairs.append((heading, "\n".join(lines)))
    pairs = [(re.sub(r"\s*\{#[^}]*\}$", "", h).strip(), b.strip()) for h, b in pairs]
    return [(h, b) for h, b in pairs if b and h.lower() not in SKIP]


def answers(state: str) -> dict[str, float]:
    """Expected level, 0 to 3, on each question in QUESTIONS."""
    payload = {"model": MODEL, "state": state, "questions": QUESTIONS}
    req = urllib.request.Request(
        f"{OLLAMA}/v1/systemone",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        body = json.load(r)["answers"]
    return {k: float(body[k]["score"]) for k in QUESTIONS}


def score(a: dict[str, float]) -> int:
    # Prior knowledge decides the level; code depth only nudges it
    return round(100 + (0.75 * a["knowledge"] + 0.25 * a["code"]) * 100)


def score_post(path: Path) -> dict:
    # Raw scores only: layouts/partials/depth.html turns them into levels with the cutoffs in hugo.toml
    scored = []
    for heading, body in sections(path.read_text(encoding="utf-8")):
        scored.append({"heading": heading, "score": score(answers(f"## {heading}\n\n{body}"))})
        print(f"  {scored[-1]['score']:>4}  {heading}")
    return {"sections": scored}


def load() -> dict:
    return json.loads(DATA.read_text(encoding="utf-8")) if DATA.exists() else {}


def ranks(values: list[float]) -> list[float]:
    order = sorted(range(len(values)), key=values.__getitem__)
    r = [0.0] * len(values)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and values[order[j + 1]] == values[order[i]]:
            j += 1
        for k in order[i : j + 1]:
            r[k] = (i + j) / 2 + 1
        i = j + 1
    return r


def spearman(a: list[float], b: list[float]) -> float:
    ra, rb = ranks(a), ranks(b)
    ma, mb = sum(ra) / len(ra), sum(rb) / len(rb)
    cov = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    return cov / (sum((x - ma) ** 2 for x in ra) * sum((y - mb) ** 2 for y in rb)) ** 0.5


def calibrate() -> None:
    """Score Pedro's hand-labelled sections (scripts/depth-labels.json) and print Spearman."""
    labels = json.loads((ROOT / "scripts" / "depth-labels.json").read_text(encoding="utf-8"))
    mine, rows = [], []
    for post, wanted in labels.items():
        found = dict(sections((BLOG / f"{post}.md").read_text(encoding="utf-8")))
        for heading, level_ in wanted.items():
            a = answers(f"## {heading}\n\n{found[heading]}")
            mine.append(level_)
            rows.append({**a, "score": score(a)})
            print(f"  {level_:>4} {rows[-1]['score']:>4}  k={a['knowledge']:.2f} c={a['code']:.2f}  {heading}")
    for key in ("knowledge", "code", "score"):
        print(f"Spearman {key}: {spearman(mine, [r[key] for r in rows]):.2f} over {len(mine)} sections")


def main(args: list[str]) -> None:
    if args == ["--calibrate"]:
        return calibrate()
    posts = sorted(BLOG.glob("2*.md")) if args == ["--all"] else [BLOG / f"{Path(a).stem}.md" for a in args]
    if not posts:
        sys.exit(__doc__)
    data = load()
    for path in posts:
        print(path.stem)
        data[path.stem] = score_post(path)
    # JSON is valid YAML, and Hugo reads data/depth.yaml either way
    DATA.write_text(json.dumps(dict(sorted(data.items())), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1:])
