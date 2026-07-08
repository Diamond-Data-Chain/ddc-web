from pathlib import Path
import re
import shutil
import sys

ROOT = Path(".")
APP = ROOT / "app"

if not APP.exists():
    print("ERROR: ./app not found (run from repo root).")
    sys.exit(1)

tsx_files = list(APP.rglob("*.tsx"))
candidates = []
for p in tsx_files:
    txt = p.read_text(errors="ignore")
    if "Connect wallet" in txt or "ConnectWalletButton" in txt:
        candidates.append(p)

if not candidates:
    print("ERROR: No .tsx files containing 'Connect wallet' or 'ConnectWalletButton' found under ./app")
    sys.exit(1)

# Pick best target:
# 1) Navbar that uses ConnectWalletButton
target = None
mode = None
for p in candidates:
    if p.name.lower() == "navbar.tsx":
        txt = p.read_text(errors="ignore")
        if "ConnectWalletButton" in txt or "Connect wallet" in txt:
            target = p
            mode = "navbar"
            break

# 2) ConnectWalletButton component
if not target:
    for p in candidates:
        if p.name == "ConnectWalletButton.tsx":
            target = p
            mode = "button_component"
            break

# 3) any file that contains "Connect wallet"
if not target:
    for p in candidates:
        txt = p.read_text(errors="ignore")
        if "Connect wallet" in txt:
            target = p
            mode = "generic"
            break

if not target:
    print("ERROR: Could not choose a target file.")
    for p in candidates:
        print(" -", p)
    sys.exit(1)

txt = target.read_text(errors="ignore")

# Ensure Link import
if "next/link" not in txt:
    # place after 'use client' and imports
    # find first import line
    m = re.search(r'^(import .+)$', txt, flags=re.MULTILINE)
    if m:
        insert_at = m.start()
        txt = txt[:insert_at] + 'import Link from "next/link";\n' + txt[insert_at:]
    else:
        # fallback: top
        txt = 'import Link from "next/link";\n' + txt

# Find the connect button occurrence by locating "Connect wallet" string
idx = txt.find("Connect wallet")
if idx == -1:
    print(f"ERROR: Target chosen ({target}) does not contain 'Connect wallet'.")
    print("Tip: target might use a different label; manually search in the file.")
    sys.exit(1)

# Find nearest preceding <button ...> start
btn_start = txt.rfind("<button", 0, idx)
if btn_start == -1:
    print(f"ERROR: Could not find '<button' before 'Connect wallet' in {target}")
    sys.exit(1)

# Extract className attribute from that button (reuse styles)
btn_tag_end = txt.find(">", btn_start)
btn_tag = txt[btn_start:btn_tag_end+1]

cls = None
m = re.search(r'className=\{([^}]+)\}', btn_tag)
if m:
    cls = "{%s}" % m.group(1).strip()
else:
    m = re.search(r'className="([^"]+)"', btn_tag)
    if m:
        cls = '"%s"' % m.group(1)

# Build Link JSX (reuse class if possible)
if cls is None:
    # safe fallback minimal (won't break)
    cls_attr = 'className="px-4 py-2 rounded-full border border-slate-600/70 bg-black/30 hover:bg-slate-500/10 text-sm font-medium transition-all"'
else:
    cls_attr = f"className={cls}"

link_block = f'''<Link href="/my-record" {cls_attr}>
        My DDC Token
      </Link>

      <Link href="/treasury" {cls_attr}>
        Treasury DDC Token
      </Link>

      '''

# Avoid double insertion
if 'href="/my-record"' in txt or 'href="/treasury"' in txt:
    print("OK: Links already present in", target)
    sys.exit(0)

# Insert links just before the connect <button ...>
# Keep indentation same as button line
line_start = txt.rfind("\n", 0, btn_start) + 1
indent = re.match(r"\s*", txt[line_start:btn_start]).group(0)
indented_block = "\n".join(indent + l if l.strip() else "" for l in link_block.splitlines()) + "\n"

txt2 = txt[:btn_start] + indented_block + txt[btn_start:]

# Backup and write
bak = target.with_suffix(target.suffix + ".bak_ddc_links")
shutil.copyfile(target, bak)
target.write_text(txt2)

print("OK patched:", target)
print("Backup:", bak)
