import postgres from "postgres";
import type { Lead, LeadFilters, LeadStats } from "./types";
import { todayISODate } from "./date";

let cachedSql: postgres.Sql | null = null;

// לקוח ה-DB נוצר רק בשימוש הראשון (lazy), כדי ש-`next build` לא ייכשל
// כשאין עדיין משתנה סביבה של מסד נתונים (למשל לפני שחוברה אינטגרציית Postgres).
function getSql(): postgres.Sql {
  if (!cachedSql) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING;

    if (!connectionString) {
      throw new Error(
        "לא נמצא משתנה סביבה לחיבור למסד הנתונים (DATABASE_URL / POSTGRES_URL). " +
          "חברו מסד Postgres דרך Vercel: Storage → Create Database."
      );
    }

    cachedSql = postgres(connectionString, {
      ssl: "require",
      // מחובר דרך ה-pooler של Supabase (Supavisor, transaction mode) שלא תומך
      // ב-prepared statements בין שאילתות שונות.
      prepare: false,
    });
  }
  return cachedSql;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          phone TEXT,
          source TEXT,
          status TEXT NOT NULL DEFAULT 'נקבעה שיחה',
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      // מיגרציות תוספתיות ואידמפוטנטיות - בטוחות להרצה חוזרת בכל cold start
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_number TEXT`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMP`;
      await sql`ALTER TABLE leads DROP COLUMN IF EXISTS follow_up_date`;
      await sql`ALTER TABLE leads ALTER COLUMN status SET DEFAULT 'נקבעה שיחה'`;
      await sql`CREATE INDEX IF NOT EXISTS leads_follow_up_at_idx ON leads (follow_up_at)`;
      await sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status)`;
    })();
  }
  return schemaReady;
}

export async function getTodayFollowUps(): Promise<Lead[]> {
  await ensureSchema();
  const sql = getSql();
  const today = todayISODate();
  const rows = await sql<Lead[]>`
    SELECT
      id, full_name, phone, customer_number, source, status,
      follow_up_at::text AS follow_up_at,
      notes,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM leads
    WHERE follow_up_at IS NOT NULL
      AND follow_up_at::date <= ${today}::date
      AND status NOT IN ('לא רלוונטי', 'נסגר-לקוח')
    ORDER BY follow_up_at ASC
  `;
  return rows;
}

export async function getStats(): Promise<LeadStats> {
  await ensureSchema();
  const sql = getSql();
  const today = todayISODate();
  const [totals] = await sql<
    { total: string; due_today: string; overdue: string }[]
  >`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE follow_up_at::date = ${today}::date) AS due_today,
      COUNT(*) FILTER (
        WHERE follow_up_at::date < ${today}::date
        AND status NOT IN ('לא רלוונטי', 'נסגר-לקוח')
      ) AS overdue
    FROM leads
  `;
  const byStatus = await sql<{ status: string; count: string }[]>`
    SELECT status, COUNT(*) AS count FROM leads GROUP BY status ORDER BY status
  `;
  return {
    total: Number(totals?.total ?? 0),
    dueToday: Number(totals?.due_today ?? 0),
    overdue: Number(totals?.overdue ?? 0),
    byStatus: byStatus.map((row) => ({ status: row.status, count: Number(row.count) })),
  };
}

export async function getAllLeads(filters: LeadFilters): Promise<Lead[]> {
  await ensureSchema();
  const sql = getSql();
  const { search, status, source, sort } = filters;

  const searchFilter = search
    ? sql`AND (full_name ILIKE ${"%" + search + "%"} OR phone ILIKE ${"%" + search + "%"})`
    : sql``;
  const statusFilter = status ? sql`AND status = ${status}` : sql``;
  const sourceFilter = source ? sql`AND source = ${source}` : sql``;

  const orderBy =
    sort === "follow_up_desc"
      ? sql`ORDER BY follow_up_at DESC NULLS LAST, created_at DESC`
      : sort === "created_desc"
        ? sql`ORDER BY created_at DESC`
        : sort === "name_asc"
          ? sql`ORDER BY full_name ASC`
          : sql`ORDER BY follow_up_at ASC NULLS LAST, created_at DESC`;

  const rows = await sql<Lead[]>`
    SELECT
      id, full_name, phone, customer_number, source, status,
      follow_up_at::text AS follow_up_at,
      notes,
      created_at::text AS created_at,
      updated_at::text AS updated_at
    FROM leads
    WHERE 1=1 ${searchFilter} ${statusFilter} ${sourceFilter}
    ${orderBy}
  `;
  return rows;
}

export interface NewLeadInput {
  full_name: string;
  phone: string | null;
  customer_number: string | null;
  source: string | null;
  follow_up_at: string | null;
  notes: string | null;
}

export async function createLead(input: NewLeadInput): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  // status לא מוזכר בכוונה - עמודת ה-DB מפילה אותו אוטומטית ל-DEFAULT ('נקבעה שיחה')
  await sql`
    INSERT INTO leads (full_name, phone, customer_number, source, follow_up_at, notes)
    VALUES (${input.full_name}, ${input.phone}, ${input.customer_number}, ${input.source}, ${input.follow_up_at}, ${input.notes})
  `;
}

export async function updateLead(
  id: number,
  input: NewLeadInput
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  // status לא נכלל בכוונה - נשמר כפי שהוא, עדכון סטטוס נעשה רק דרך updateStatus
  await sql`
    UPDATE leads SET
      full_name = ${input.full_name},
      phone = ${input.phone},
      customer_number = ${input.customer_number},
      source = ${input.source},
      follow_up_at = ${input.follow_up_at},
      notes = ${input.notes},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function updateFollowUpAt(
  id: number,
  followUpAt: string | null
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE leads SET follow_up_at = ${followUpAt}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function updateStatus(id: number, status: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE leads SET status = ${status}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteLead(id: number): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`DELETE FROM leads WHERE id = ${id}`;
}
