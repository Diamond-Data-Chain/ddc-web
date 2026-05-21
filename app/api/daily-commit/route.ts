import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get("file") || "";
    if (!file || !file.endsWith(".json")) {
      return NextResponse.json({ error: "Missing or invalid file param" }, { status: 400 });
    }

    // prevent path traversal
    if (file.includes("..") || file.includes("/") || file.includes("\\")) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    const full = path.join(process.cwd(), "docs", "commits", file);
    if (!fs.existsSync(full)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const raw = fs.readFileSync(full, "utf8");
    const json = JSON.parse(raw);
    return NextResponse.json({ file, data: json });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
