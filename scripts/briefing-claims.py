"""Print the homepage briefing claims built from src/data/briefing_claims.yaml.

Mirrors partials/briefing-claim.html: each part is the edition's day number modulo its
list's length. The lengths must share no factor, so no sentence repeats until every
combination has been used. Change both together.

    python scripts/briefing-claims.py                  # the next 14 days, both languages
    python scripts/briefing-claims.py --days 60 --lang nb
    python scripts/briefing-claims.py --all --lang en  # every combination, for proofreading
    python scripts/briefing-claims.py --kept 80 --of 290
"""

import argparse
import datetime as dt
import pathlib

import yaml

DATA = pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "briefing_claims.yaml"


def share(claims, kept, of):
    ratio = kept / of
    nearest = min(claims["shares"], key=lambda entry: abs(ratio - entry["at"]))
    gap = ratio - nearest["at"]
    qualifiers = claims["qualifiers"]
    word = qualifiers["over"] if gap >= 0.05 else qualifiers["justOver"] if gap >= 0.015 else qualifiers["under"] if gap <= -0.05 else qualifiers["justUnder"] if gap <= -0.015 else qualifiers["about"]
    return f"{word} {nearest['name']}"


def sizes(claims):
    return [len(claims[key]) for key in ("patterns", "times", "subjects", "reads", "ends")]


def sentence(claims, picks, kept, of):
    pattern_index, time_index, subject_index, read_index, end_index = picks
    time, subject, read = claims["times"][time_index], claims["subjects"][subject_index], claims["reads"][read_index]
    out = claims["patterns"][pattern_index]
    for key, value in (
        ("{Time}", time["lead"]), ("{time}", time["mid"]),
        ("{Subject}", subject[:1].upper() + subject[1:]), ("{subject}", subject),
        ("{verb}", read["verb"]), ("{rest}", read["rest"]), ("{end}", claims["ends"][end_index]),
        ("{Share}", share(claims, kept, of)[:1].upper() + share(claims, kept, of)[1:]), ("{share}", share(claims, kept, of)), ("{kept}", str(kept)), ("{of}", str(of)),
    ):
        out = out.replace(key, value)
    return out


def picks_for(claims, day):
    return [day % size for size in sizes(claims)]


def check_coprime(lang, claims):
    import math
    lengths = sizes(claims)
    for i in range(len(lengths)):
        for j in range(i + 1, len(lengths)):
            if math.gcd(lengths[i], lengths[j]) != 1:
                raise SystemExit(f"{lang}: list lengths {lengths} share a factor; make them pairwise coprime")


def total(claims):
    count = 1
    for size in sizes(claims):
        count *= size
    return count


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["en", "nb"], nargs="*", default=["en", "nb"])
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--all", action="store_true", help="every combination, not a date range")
    ap.add_argument("--kept", type=int, default=110)
    ap.add_argument("--of", type=int, default=306)
    args = ap.parse_args()
    data = yaml.safe_load(DATA.read_text(encoding="utf-8"))
    today = dt.date.today()
    epoch = dt.date(1970, 1, 1)
    for lang in args.lang:
        claims = data[lang]
        check_coprime(lang, claims)
        print(f"## {lang}: {total(claims)} combinations, no repeat for {total(claims)} days")
        if args.all:
            import itertools
            for picks in itertools.product(*(range(n) for n in sizes(claims))):
                print(sentence(claims, picks, args.kept, args.of))
        else:
            for offset in range(args.days):
                day = today + dt.timedelta(days=offset)
                print(day.isoformat(), sentence(claims, picks_for(claims, (day - epoch).days), args.kept, args.of))
        print()


if __name__ == "__main__":
    main()
