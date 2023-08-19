import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (req.nextUrl.pathname.startsWith("/sign-in" || "sign-up")) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return null;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
}

export const config = {
  matcher: ["/u/:path*", "/sign-in", "/sign-up"],
};
