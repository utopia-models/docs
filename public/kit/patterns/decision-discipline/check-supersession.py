#!/usr/bin/env python3
"""Check that every decision record's supersession links are whole, in both directions.

    python3 check-supersession.py [DIR]            check the working tree (default DIR: decisions)
    python3 check-supersession.py --staged [DIR]   check what is STAGED — for a git pre-commit hook

Exit 0 and one summary line when every link is whole. Exit 1 and one line per broken link otherwise.
Exit 2 when DIR does not exist.

WHAT IT ENFORCES, and nothing else:
  a record that says   Supersedes: X      → X exists, and X says  Superseded-by: <this record>
  a record that says   Superseded-by: Y   → Y exists, Y says Supersedes: <this record>, Status is superseded
  a record with        Status: superseded → it names what superseded it
  Status is one of     proposed · accepted · superseded · killed

WHY --staged EXISTS. The rule is "edit the old record in the SAME COMMIT as its successor". Checking the
working tree cannot see that: the old record can be edited and left unstaged, the check passes, and the
commit lands the new record alone. --staged reads the index, which is exactly what the commit will hold.

It reads headers only — the first lines of the form `Key: value` before the first `# ` heading — and
never judges whether a decision was right. Links are file names relative to DIR.
Standard library only, so a hook that calls it never needs an install step.
"""
import pathlib, re, subprocess, sys

STATUSES = {"proposed", "accepted", "superseded", "killed"}
HEADER = re.compile(r"^(Status|Date|Supersedes|Superseded-by)\s*:\s*(.*?)\s*$", re.I)


def headers(text: str) -> dict:
    out = {}
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)   # a copied template keeps its comment
    for line in text.splitlines():
        if line.startswith("# "):
            break
        m = HEADER.match(line)
        if m:
            out[m.group(1).lower()] = m.group(2).strip()
    return out


def target(value: str) -> str:
    """`Superseded-by: 0007-use-sqlite.md` or a markdown link to it → `0007-use-sqlite.md`."""
    m = re.search(r"\(([^)]+)\)", value)
    return pathlib.PurePosixPath((m.group(1) if m else value).strip()).name


def read_records(directory: str, staged: bool) -> dict:
    if staged:
        listed = subprocess.run(["git", "ls-files", "--cached", "--", directory],
                                capture_output=True, text=True, check=True).stdout.split()
        records = {}
        for path in listed:
            if path.endswith(".md"):
                blob = subprocess.run(["git", "show", f":./{path}"], capture_output=True, text=True)
                records[pathlib.PurePosixPath(path).name] = blob.stdout
        return records
    return {p.name: p.read_text(errors="replace") for p in pathlib.Path(directory).glob("*.md")}


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--staged"]
    staged = "--staged" in sys.argv[1:]
    directory = args[0] if args else "decisions"
    if not pathlib.Path(directory).is_dir():
        print(f"no such directory: {directory}")
        return 2

    records = {name: headers(text) for name, text in read_records(directory, staged).items()
               if name.upper() not in ("TEMPLATE.MD", "README.MD")}
    problems, links = [], 0

    for name, h in sorted(records.items()):
        status = h.get("status", "").lower()
        if status not in STATUSES:
            problems.append(f"{name}: Status is '{h.get('status', '')}' — must be one of "
                            f"{' · '.join(sorted(STATUSES))}")

        if h.get("supersedes"):
            links += 1
            old = target(h["supersedes"])
            if old not in records:
                problems.append(f"{name}: Supersedes {old}, which does not exist in {directory}/")
            elif target(records[old].get("superseded-by", "")) != name:
                problems.append(f"{name}: Supersedes {old}, but {old} does not say "
                                f"'Superseded-by: {name}' — edit it in this same commit")

        if h.get("superseded-by"):
            new = target(h["superseded-by"])
            if new not in records:
                problems.append(f"{name}: Superseded-by {new}, which does not exist in {directory}/")
            elif target(records[new].get("supersedes", "")) != name:
                problems.append(f"{name}: Superseded-by {new}, but {new} does not say "
                                f"'Supersedes: {name}'")
            if status != "superseded":
                problems.append(f"{name}: names a successor but Status is '{status}', not superseded")
        elif status == "superseded":
            problems.append(f"{name}: Status is superseded but Superseded-by is empty — "
                            f"a dead decision that does not say what replaced it")

    where = "staged" if staged else "working tree"
    if problems:
        print("\n".join(problems))
        print(f"BROKEN — {len(problems)} problem(s) in {len(records)} record(s), {where}")
        return 1
    print(f"ok — {len(records)} record(s), {links} supersession(s), {where}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
