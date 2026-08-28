import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = process.env.DDC_WATCH_TRIGGER_SECRET;

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_WORKFLOW_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_WORKFLOW_TOKEN" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.github.com/repos/Diamond-Data-Chain/ddc-web/actions/workflows/ddc-token-records.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "GitHub dispatch failed", details: text },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true });
}
