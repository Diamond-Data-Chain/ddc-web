from pathlib import Path
import re, shutil, sys

def backup_write(p: Path, new_txt: str):
    bak = p.with_suffix(p.suffix + ".bak_relocate_ddc")
    if not bak.exists():
        shutil.copyfile(p, bak)
    p.write_text(new_txt)

def remove_nav_links(txt: str) -> str:
    # remove both Link blocks regardless of className
    txt = re.sub(r'\s*<Link\s+href="/my-record"[\s\S]*?</Link>\s*', '\n', txt, flags=re.MULTILINE)
    txt = re.sub(r'\s*<Link\s+href="/treasury"[\s\S]*?</Link>\s*', '\n', txt, flags=re.MULTILINE)
    return txt

def ensure_link_import(txt: str) -> str:
    if re.search(r'from\s+[\'"]next/link[\'"]', txt):
        return txt
    m = re.search(r'^["\']use client["\'];\s*$', txt, flags=re.MULTILINE)
    if m:
        ins = m.end()
        return txt[:ins] + '\n\nimport Link from "next/link";\n' + txt[ins:]
    m = re.search(r'^(import .+)$', txt, flags=re.MULTILINE)
    if m:
        ins = m.start()
        return txt[:ins] + 'import Link from "next/link";\n' + txt[ins:]
    return 'import Link from "next/link";\n' + txt

def ensure_import(txt: str, symbol: str, from_path: str) -> str:
    if from_path in txt and symbol in txt:
        return txt
    # insert after last import
    imports = list(re.finditer(r'^import .*?;\s*$', txt, flags=re.MULTILINE))
    if imports:
        ins = imports[-1].end()
        return txt[:ins] + f'\nimport {symbol} from "{from_path}";\n' + txt[ins:]
    return f'import {symbol} from "{from_path}";\n' + txt

def insert_before_last_closing_tag(txt: str, block: str) -> str:
    # insert block before last closing tag like </section> or </div> in file
    m = list(re.finditer(r'</[a-zA-Z][^>]*>', txt))
    if not m:
        return txt + "\n" + block + "\n"
    last = m[-1]
    # determine indentation of that closing line
    line_start = txt.rfind("\n", 0, last.start()) + 1
    indent = re.match(r'\s*', txt[line_start:last.start()]).group(0)
    indented = "\n".join(indent + l if l.strip() else "" for l in block.splitlines()) + "\n"
    return txt[:last.start()] + indented + txt[last.start():]

APP = Path("app")
if not APP.exists():
    print("ERROR: run from repo root (./app missing)")
    sys.exit(1)

# 1) Remove the links from wherever they were inserted (navbar/connect area)
for p in APP.rglob("*.tsx"):
    s = p.read_text(errors="ignore")
    if 'href="/my-record"' in s or 'href="/treasury"' in s:
        ns = remove_nav_links(s)
        if ns != s:
            backup_write(p, ns)
            print("OK removed top links from:", p)

# 2) MyDDCOverview: add button
my = APP / "(sections)" / "MyDDCOverview.tsx"
if my.exists():
    s = my.read_text(errors="ignore")
    s = ensure_link_import(s)
    if 'href="/my-record"' not in s:
        btn = (
            '<div className="mt-6 flex flex-wrap gap-3">\n'
            '  <Link\n'
            '    href="/my-record"\n'
            '    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"\n'
            '  >\n'
            '    My DDC Token\n'
            '  </Link>\n'
            '</div>\n'
        )
        s = insert_before_last_closing_tag(s, btn)
        backup_write(my, s)
        print("OK added My DDC Token button to:", my)
else:
    print("WARN: missing", my)

# 3) Tokenomics: add allocation mini table + treasury button
tok = APP / "(sections)" / "Tokenomics.tsx"
if tok.exists():
    s = tok.read_text(errors="ignore")
    # import component
    if "TreasuryAllocationMini" not in s:
        s = ensure_import(s, "TreasuryAllocationMini", "@/components/treasury/TreasuryAllocationMini")
    if "<TreasuryAllocationMini" not in s:
        block = "<TreasuryAllocationMini />\n"
        s = insert_before_last_closing_tag(s, block)
        backup_write(tok, s)
        print("OK added TreasuryAllocationMini into:", tok)
else:
    print("WARN: missing", tok)

