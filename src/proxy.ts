import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;
  const startsWithSignIn = pathname.startsWith("/sign-in");
  const startsWithSignUp = pathname.startsWith("/sign-up");

  if (startsWithSignIn || startsWithSignUp) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const redirectUrl = new URL(`/sign-in`, req.nextUrl);
    redirectUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/submit",
    "/r/:path/submit",
    "/communities/create",
    "/settings/:path*",
  ],
};
