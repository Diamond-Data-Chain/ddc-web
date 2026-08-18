import { NextRequest, NextResponse } from "next/server";

const REVIEW_COOKIE = "seven_rol_review";

export function middleware(request: NextRequest) {
  const expectedToken = process.env.SEVEN_ROL_REVIEW_SESSION_TOKEN;
  const suppliedToken = request.cookies.get(REVIEW_COOKIE)?.value;

  if (!expectedToken || suppliedToken !== expectedToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/review-access";
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}

export const config = {
  matcher: ["/seven-rol-mapping/:path*"],
};
