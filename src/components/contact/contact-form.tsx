"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InkArrow } from "@/components/ui/ink-arrow";

type FormState = "idle" | "loading" | "success" | "error";

type ContactFormProps = {
  className?: string;
};

const fieldClass =
  "w-full border-0 border-b border-dashed border-[var(--journal-faint,var(--border))] bg-transparent px-0 py-2.5 text-sm text-[var(--journal-ink,var(--foreground))] outline-none transition-[border-color] placeholder:text-[var(--journal-muted,var(--muted-foreground))] focus:border-[var(--accent)]";

export function ContactForm({ className }: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [emailed, setEmailed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        emailed?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setEmailed(Boolean(data?.emailed));
      setState("success");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to send message.");
    }
  };

  return (
    <div className={cn("journal-entry p-6 sm:p-8", className)}>
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-dashed border-[var(--journal-faint,var(--border))] pb-4">
        <p className="font-hand text-xl text-[var(--journal-ink,var(--ink))]">
          a short note
        </p>
        <p className="margin-note text-sm">send →</p>
      </div>

      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center"
          >
            <CheckCircle2 className="size-10 text-[var(--accent)]" />
            <div className="space-y-2">
              <h3 className="font-hand text-[1.85rem] text-[var(--journal-ink,var(--ink))]">
                Message sent
              </h3>
              <p className="max-w-sm text-sm text-[var(--journal-muted,var(--muted))]">
                {emailed
                  ? "Your note is on its way — I’ll reply soon."
                  : "Your note was received and saved. I’ll get back to you soon."}
              </p>
            </div>
            <Button
              type="button"
              variant="ink"
              onClick={() => setState("idle")}
            >
              Write another
              <InkArrow direction="right" tone="accent" className="size-3.5" />
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, website: e.target.value }))
              }
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium tracking-wide text-[var(--journal-muted,var(--muted))]">
                  Name
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={fieldClass}
                  placeholder="Your name"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium tracking-wide text-[var(--journal-muted,var(--muted))]">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={fieldClass}
                  placeholder="you@company.com"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium tracking-wide text-[var(--journal-muted,var(--muted))]">
                Subject
              </span>
              <input
                required
                name="subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                className={fieldClass}
                placeholder="How can I help?"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium tracking-wide text-[var(--journal-muted,var(--muted))]">
                Message
              </span>
              <textarea
                required
                name="message"
                rows={6}
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                className={cn(fieldClass, "min-h-[140px] resize-y")}
                placeholder="Share a bit about the opportunity or question…"
              />
            </label>

            {state === "error" && error ? (
              <p
                role="alert"
                className="border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={state === "loading"}
              className="w-full sm:w-auto"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <InkArrow
                    direction="right"
                    className="size-4 text-[var(--accent-foreground)]"
                  />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
