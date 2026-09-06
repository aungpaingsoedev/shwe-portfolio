"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/app/admin/actions";
import {
  DataTable,
  DataTableCell,
  DataTableRow,
} from "@/components/admin/data-table";
import { cn, formatDate } from "@/lib/utils";
import type { ContactMessage, MessageStatus } from "@/types";

const FILTERS: Array<"all" | MessageStatus> = [
  "all",
  "unread",
  "read",
  "archived",
];

export function MessagesAdmin({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, query]);

  const setStatus = (id: string, status: MessageStatus) => {
    setError(null);
    startTransition(async () => {
      try {
        await updateMessageStatusAction(id, status);
        setSelected((prev) =>
          prev?.id === id ? { ...prev, status } : prev,
        );
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update failed");
      }
    });
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteMessageAction(id);
        setSelected((prev) => (prev?.id === id ? null : prev));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Delete failed");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          columns={[
            { key: "from", header: "From" },
            { key: "subject", header: "Subject" },
            { key: "status", header: "Status" },
            { key: "date", header: "Date" },
          ]}
          empty={
            filtered.length === 0
              ? "No messages yet. Submissions from /contact will appear here."
              : undefined
          }
        >
          {filtered.map((msg) => (
            <DataTableRow
              key={msg.id}
              className={cn(
                "cursor-pointer",
                selected?.id === msg.id && "bg-[var(--accent-soft)]/50",
                pending && "opacity-70",
              )}
            >
              <DataTableCell>
                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setSelected(msg);
                    if (msg.status === "unread") setStatus(msg.id, "read");
                  }}
                >
                  <p className="font-medium">{msg.name}</p>
                  <p className="text-xs text-[var(--muted)]">{msg.email}</p>
                </button>
              </DataTableCell>
              <DataTableCell>
                <button
                  type="button"
                  className="line-clamp-1 text-left"
                  onClick={() => {
                    setSelected(msg);
                    if (msg.status === "unread") setStatus(msg.id, "read");
                  }}
                >
                  {msg.subject}
                </button>
              </DataTableCell>
              <DataTableCell>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs capitalize",
                    msg.status === "unread"
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] text-[var(--muted)]",
                  )}
                >
                  {msg.status}
                </span>
              </DataTableCell>
              <DataTableCell className="text-[var(--muted)]">
                {formatDate(msg.created_at)}
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  {formatDate(selected.created_at)}
                </p>
                <h2 className="mt-1 font-semibold text-2xl tracking-tight">
                  {selected.subject}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {selected.name} ·{" "}
                  <a
                    className="text-[var(--accent)] hover:underline"
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  >
                    {selected.email}
                  </a>
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                {selected.message}
              </p>
              <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                {(["unread", "read", "archived"] as MessageStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatus(selected.id, status)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
                        selected.status === status
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]",
                      )}
                    >
                      Mark {status}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => remove(selected.id)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-[var(--muted)]">
              Select a message to read.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
