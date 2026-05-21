import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "docs", "commits");
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ error: "docs/commits folder not found" }, { status: 404 });
    }

    const items = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const full = path.join(dir, f);
        const st = fs.statSync(full);
        return { file: f, mtimeMs: st.mtimeMs, size: st.size };
      })
      .sort((a, b) => b.mtimeMs - a.mtimeMs);

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
