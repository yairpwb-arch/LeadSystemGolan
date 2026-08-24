import { getAllLeads, getStats, getTodayFollowUps } from "@/lib/db";
import type { LeadFilters } from "@/lib/types";
import StatsBar from "@/app/components/StatsBar";
import TodayFollowUps from "@/app/components/TodayFollowUps";
import FilterBar from "@/app/components/FilterBar";
import LeadsTable from "@/app/components/LeadsTable";
import LeadFormDialog from "@/app/components/LeadFormDialog";
import LogoutButton from "@/app/components/LogoutButton";

export const dynamic = "force-dynamic";

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;

  const filters: LeadFilters = {
    search: firstValue(searchParams?.search),
    status: firstValue(searchParams?.status),
    source: firstValue(searchParams?.source),
    sort: firstValue(searchParams?.sort) as LeadFilters["sort"],
  };

  const [stats, todayLeads, allLeads] = await Promise.all([
    getStats(),
    getTodayFollowUps(),
    getAllLeads(filters),
  ]);

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ניהול לידים</h1>
        <LogoutButton />
      </header>

      <StatsBar stats={stats} />

      <TodayFollowUps leads={todayLeads} />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-semibold">כל הלידים</h2>
          <LeadFormDialog
            trigger={
              <button className="rounded-lg bg-brand px-4 py-2 text-sm text-white font-medium hover:bg-brand-hover">
                + ליד חדש
              </button>
            }
          />
        </div>

        <FilterBar />

        <LeadsTable leads={allLeads} />
      </section>
    </main>
  );
}
