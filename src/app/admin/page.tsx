import Link from "next/link";
import {
  Eye,
  FileText,
  FolderKanban,
  Mail,
  MessageSquare,
  PenLine,
  Settings,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import {
  DataTable,
  DataTableCell,
  DataTableRow,
} from "@/components/admin/data-table";
import { getDashboardStats, getMessages } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";

const QUICK_LINKS = [
  {
    href: "/admin/content",
    label: "Edit site text",
    description: "Hero, sections, CTAs, and page headings",
    icon: PenLine,
  },
  {
    href: "/admin/settings",
    label: "Profile & settings",
    description: "Name, tagline, contact email, resume",
    icon: Settings,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    description: "Case studies and portfolio entries",
    icon: FolderKanban,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Contact form inbox",
    icon: Mail,
  },
] as const;

export default async function AdminDashboardPage() {
  const [stats, messages] = await Promise.all([
    getDashboardStats(),
    getMessages(),
  ]);
  const recent = messages.slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Overview of portfolio content and inbound messages.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
            >
              <Icon
                className="size-5 text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]"
                strokeWidth={1.75}
              />
              <p className="mt-3 font-medium text-[var(--foreground)]">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {item.description}
              </p>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          index={0}
          label="Total Projects"
          value={stats.totalProjects}
          icon={<FolderKanban className="size-5" strokeWidth={1.75} />}
          hint={`${stats.publishedProjects} published`}
        />
        <StatCard
          index={1}
          label="Published Projects"
          value={stats.publishedProjects}
          icon={<FolderKanban className="size-5" strokeWidth={1.75} />}
        />
        <StatCard
          index={2}
          label="Blog Posts"
          value={stats.totalPosts}
          icon={<FileText className="size-5" strokeWidth={1.75} />}
          hint={`${stats.publishedPosts} published`}
        />
        <StatCard
          index={3}
          label="Published Posts"
          value={stats.publishedPosts}
          icon={<FileText className="size-5" strokeWidth={1.75} />}
        />
        <StatCard
          index={4}
          label="Contact Messages"
          value={stats.contactMessages}
          icon={<Mail className="size-5" strokeWidth={1.75} />}
          hint={`${stats.unreadMessages} unread`}
        />
        <StatCard
          index={5}
          label="Views"
          value={stats.totalViews}
          icon={<Eye className="size-5" strokeWidth={1.75} />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Recent messages
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Latest contact form submissions
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>

        <DataTable
          columns={[
            { key: "name", header: "From" },
            { key: "subject", header: "Subject" },
            { key: "status", header: "Status" },
            { key: "date", header: "Date" },
          ]}
          empty={recent.length === 0 ? "No messages yet." : undefined}
        >
          {recent.map((msg) => (
            <DataTableRow key={msg.id}>
              <DataTableCell>
                <div>
                  <p className="font-medium">{msg.name}</p>
                  <p className="text-xs text-[var(--muted)]">{msg.email}</p>
                </div>
              </DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-3.5 shrink-0 text-[var(--muted)]" />
                  <span className="line-clamp-1">{msg.subject}</span>
                </div>
              </DataTableCell>
              <DataTableCell>
                <span
                  className={
                    msg.status === "unread"
                      ? "rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]"
                      : "rounded-full bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
                  }
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
      </section>
    </div>
  );
}
