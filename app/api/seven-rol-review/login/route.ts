import { NextResponse } from "next/server";

const REVIEW_COOKIE = "seven_rol_review";
const REVIEWER_COOKIE = "seven_rol_reviewer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    const seedpoCode = process.env.SEVEN_ROL_REVIEW_CODE_SEEDPO;
    const technicalCode = process.env.SEVEN_ROL_REVIEW_CODE_TECH;
    const sessionToken = process.env.SEVEN_ROL_REVIEW_SESSION_TOKEN;

    if (!seedpoCode || !technicalCode || !sessionToken) {
      return NextResponse.json(
        { ok: false, error: "Review access is not configured." },
        { status: 503 }
      );
    }

    let reviewer: "seedpo" | "technical" | null = null;

    if (code === seedpoCode) reviewer = "seedpo";
    if (code === technicalCode) reviewer = "technical";

    if (!reviewer) {
      return NextResponse.json(
        { ok: false, error: "Invalid access code." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true, reviewer });

    response.cookies.set(REVIEW_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set(REVIEWER_COOKIE, reviewer, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to process access request." },
      { status: 400 }
    );
  }
}
