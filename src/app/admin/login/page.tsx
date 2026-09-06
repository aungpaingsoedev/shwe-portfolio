"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabaseAuth = isSupabaseConfigured();
  const [email, setEmail] = useState(supabaseAuth ? "" : "admin@shweyimon.com");
  const [password, setPassword] = useState(supabaseAuth ? "" : "admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (supabaseAuth) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw new Error(authError.message);
      } else {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (!res.ok) {
          throw new Error(data?.error || "Login failed");
        }
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 400px at 20% 10%, var(--accent-glow), transparent 60%), radial-gradient(600px 360px at 90% 80%, rgba(31,111,91,0.08), transparent 55%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]"
      >
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <LockKeyhole className="size-5" strokeWidth={1.75} />
          </div>
          <h1 className="font-semibold text-3xl tracking-tight">Admin Portal</h1>
          <p className="text-sm text-[var(--muted)]">
            {supabaseAuth
              ? "Sign in with your Supabase Auth user."
              : "Sign in to manage the Shwe Yi Mon portfolio."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="you@example.com"
              autoComplete="username"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {supabaseAuth ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--accent-soft)]/40 px-4 py-3 text-center text-xs leading-relaxed text-[var(--muted)]">
            Create your admin user in Supabase → Authentication → Users, then
            sign in with that email and password.
          </p>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--accent-soft)]/40 px-4 py-3 text-center text-xs leading-relaxed text-[var(--muted)]">
            Demo mode — use{" "}
            <span className="font-medium text-[var(--foreground)]">
              admin@shweyimon.com
            </span>{" "}
            /{" "}
            <span className="font-medium text-[var(--foreground)]">admin123</span>
            , or any non-empty credentials.
          </p>
        )}
      </motion.div>
    </div>
  );
}
