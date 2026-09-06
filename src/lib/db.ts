import { isDatabaseConfigured as checkDb } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Supabase transaction pooler + Next.js (build workers / serverless)
 * needs a tiny Prisma pool. Default Prisma limit of 3 still starves when
 * many pages query in parallel — use 1 with pgbouncer and a higher timeout.
 */
function databaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;

  const [base, query = ""] = raw.split("?");
  const params = new URLSearchParams(query);

  if (!params.has("connection_limit")) {
    params.set(
      "connection_limit",
      process.env.PRISMA_CONNECTION_LIMIT ?? "1",
    );
  }
  if (!params.has("pool_timeout")) {
    params.set("pool_timeout", process.env.PRISMA_POOL_TIMEOUT ?? "30");
  }
  // Required for PgBouncer transaction mode
  if (raw.includes("pooler.supabase.com") && !params.has("pgbouncer")) {
    params.set("pgbouncer", "true");
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function createPrismaClient() {
  const url = databaseUrl();
  return new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client across hot reloads and serverless invocations in the same isolate
globalForPrisma.prisma = prisma;

export function isDatabaseConfigured(): boolean {
  return checkDb();
}
