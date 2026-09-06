import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

/** Local demo cookie auth only. When Supabase is configured, the login page uses Auth directly. */
export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase Auth is enabled. Sign in from the login form with your Supabase user.",
      },
      { status: 400 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password?.trim() ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sym_admin_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
