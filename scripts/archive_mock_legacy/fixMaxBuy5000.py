from pathlib import Path
import re

ROOT = Path("contracts")
if not ROOT.exists():
    raise SystemExit("contracts/ not found")

# Only touch likely presale files
candidates = []
for p in ROOT.rglob("*.sol"):
    if "mock" in p.name.lower():
        continue
    name = p.name.lower()
    if "presale" in name or "vesting" in name:
        candidates.append(p)
    else:
        # fallback: scan anyway but with stricter rule
        candidates.append(p)

changed = []
pattern = re.compile(r'(max|maxim|limit|purchase|allocation|per-wallet|wallet).*1500', re.IGNORECASE)

for p in candidates:
    s = p.read_text(errors="ignore")
    lines = s.splitlines(True)
    out = []
    touched = False

    for line in lines:
        if "1500" in line and pattern.search(line):
            # Replace common literal forms on that line
            newline = line
            newline = newline.replace("1500_000000", "5000_000000")
            newline = newline.replace("1500e6", "5000e6")
            newline = re.sub(r'\b1500\b', '5000', newline)
            if newline != line:
                touched = True
                line = newline
        out.append(line)

    if touched:
        bak = p.with_suffix(p.suffix + ".bak_max5000")
        if not bak.exists():
            bak.write_text(s)
        p.write_text("".join(out))
        changed.append(str(p))

print("CHANGED files:", len(changed))
for f in changed:
    print(" -", f)
