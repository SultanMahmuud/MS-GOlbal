import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const staffAllowedPaths = [
  "/admin-login",
  "/teacher-login",
  "/dashboard/admin",
  "/dashboard/teacher",
  "/dashboard/my-courses",
  "/dashboard/analytics",
  "/dashboard/settings",
  "/dashboard/sent-feedback",
  "/dashboard/leader-board",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const allowed = staffAllowedPaths.some((path) => pathname.startsWith(path));
  if (!allowed) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
