import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "docs", "examples", "daily-commit-signed.example.crypto.json");
    if (!fs.existsSync(p)) {
      return NextResponse.json(
        { error: "Example signed daily commit JSON not found at docs/examples/daily-commit-signed.example.crypto.json" },
        { status: 404 }
      );
    }
    const raw = fs.readFileSync(p, "utf8");
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
