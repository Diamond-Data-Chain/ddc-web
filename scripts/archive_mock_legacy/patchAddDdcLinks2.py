from pathlib import Path
import re, shutil, sys

APP = Path("app")
if not APP.exists():
    print("ERROR: ./app not found (run from repo root).")
    sys.exit(1)

LINK1 = ('<Link href="/my-record"{cls}>\n'
         '  My DDC Token\n'
         '</Link>\n\n')
LINK2 = ('<Link href="/treasury"{cls}>\n'
         '  Treasury DDC Token\n'
         '</Link>\n\n')

def ensure_link_import(txt: str) -> str:
    if re.search(r'from\s+[\'"]next/link[\'"]', txt):
        return txt
    # insert after "use client" if present, else after first import, else top
    m = re.search(r'^["\']use client["\'];\s*$', txt, flags=re.MULTILINE)
    if m:
        insert_at = m.end()
        return txt[:insert_at] + '\n\nimport Link from "next/link";\n' + txt[insert_at:]
    m = re.search(r'^(import .+)$', txt, flags=re.MULTILINE)
    if m:
        insert_at = m.start()
        return txt[:insert_at] + 'import Link from "next/link";\n' + txt[insert_at:]
    return 'import Link from "next/link";\n' + txt

def indent_of(txt: str, pos: int) -> str:
    line_start = txt.rfind("\n", 0, pos) + 1
    return re.match(r"\s*", txt[line_start:pos]).group(0)

def extract_class_attr_from_tag(tag: str):
    # returns string like ' className="..."' or ' className={...}' or ''
    m = re.search(r'className=\{[^}]+\}', tag)
    if m:
        return " " + m.group(0)
    m = re.search(r'className="[^"]+"', tag)
    if m:
        return " " + m.group(0)
    return ""

def already_has_links(txt: str) -> bool:
    return 'href="/my-record"' in txt or 'href="/treasury"' in txt

def patch_file(path: Path) -> bool:
    txt = path.read_text(errors="ignore")
    if already_has_links(txt):
        return False

    txt2 = ensure_link_import(txt)

    # 1) Prefer patch near <ConnectWalletButton ... />
    m = re.search(r"<ConnectWalletButton\b[^>]*\/>", txt2)
    if m:
        tag = m.group(0)
        cls_attr = extract_class_attr_from_tag(tag)
        ins = LINK1.format(cls=cls_attr) + LINK2.format(cls=cls_attr)
        ind = indent_of(txt2, m.start())
        ins = "\n".join(ind + l if l.strip() else "" for l in ins.splitlines()) + "\n"
        out = txt2[:m.start()] + ins + txt2[m.start():]
        bak = path.with_suffix(path.suffix + ".bak_ddc_links")
        shutil.copyfile(path, bak)
        path.write_text(out)
        print("OK patched near <ConnectWalletButton/>:", path)
        print("Backup:", bak)
        return True

    # 2) Fallback: patch near a <button ...> closest to connect() usage
    # Find a connect call occurrence first
    ci = txt2.find("connect(")
    if ci != -1:
        btn_start = txt2.rfind("<button", 0, ci)
        if btn_start != -1:
            btn_tag_end = txt2.find(">", btn_start)
            btn_tag = txt2[btn_start:btn_tag_end+1]
            cls_attr = extract_class_attr_from_tag(btn_tag)
            ins = LINK1.format(cls=cls_attr) + LINK2.format(cls=cls_attr)
            ind = indent_of(txt2, btn_start)
            ins = "\n".join(ind + l if l.strip() else "" for l in ins.splitlines()) + "\n"
            out = txt2[:btn_start] + ins + txt2[btn_start:]
            bak = path.with_suffix(path.suffix + ".bak_ddc_links")
            shutil.copyfile(path, bak)
            path.write_text(out)
            print("OK patched near <button> with connect():", path)
            print("Backup:", bak)
            return True

    return False

# Scan candidates
tsx = list(APP.rglob("*.tsx"))

# Rank: files that mention ConnectWalletButton first, then those mentioning connect(
ranked = []
for p in tsx:
    s = p.read_text(errors="ignore")
    score = 0
    if "ConnectWalletButton" in s: score += 10
    if "connect(" in s: score += 5
    if "<button" in s: score += 2
    if score > 0:
        ranked.append((score, p))
ranked.sort(key=lambda x: -x[0])

if not ranked:
    print("ERROR: no candidate .tsx found containing ConnectWalletButton/connect(")
    sys.exit(1)

for score, p in ranked:
    if patch_file(p):
        sys.exit(0)

print("ERROR: Could not patch any file. Likely connect button is not a <button> or connect() is named differently.")
print("Tip: run: grep -RIn \"connect(\" app | head")
sys.exit(1)
