import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminProtected =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isSupabaseConfigured()) {
    return updateSession(request);
  }

  // Local demo auth via httpOnly cookie
  if (isAdminProtected) {
    const authed = request.cookies.get("sym_admin_session")?.value === "1";
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
