import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "docs", "commits");
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ error: "docs/commits folder not found" }, { status: 404 });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const full = path.join(dir, f);
        return { f, full, mtime: fs.statSync(full).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) {
      return NextResponse.json({ error: "No commit JSON files found in docs/commits" }, { status: 404 });
    }

    const latest = files[0].full;
    const raw = fs.readFileSync(latest, "utf8");
    const json = JSON.parse(raw);

    return NextResponse.json({ file: path.basename(latest), data: json });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
