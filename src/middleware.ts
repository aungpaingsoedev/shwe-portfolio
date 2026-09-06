import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname.startsWith("/admin/login");
  const isAdminProtected =
    pathname.startsWith("/admin") && !isAdminLogin;

  if (isSupabaseConfigured()) {
    try {
      return await updateSession(request);
    } catch (error) {
      console.error("[middleware] Supabase session failed:", error);
      if (isAdminProtected) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  }

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
  matcher: ["/admin/:path*"],
};
