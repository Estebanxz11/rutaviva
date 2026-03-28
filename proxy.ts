import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthRoute = ["/sign-in", "/sign-up"].includes(nextUrl.pathname);
  const isProtectedRoute = ["/my-places", "/planner"].some((r) =>
    nextUrl.pathname.startsWith(r)
  );

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/explore", nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
