import type { LeadStats } from "@/lib/types";

export default function StatsBar({ stats }: { stats: LeadStats }) {
  const tiles = [
    { label: "סה\"כ לידים", value: stats.total },
    { label: "ממתינים להיום", value: stats.dueToday },
    { label: "באיחור", value: stats.overdue, danger: stats.overdue > 0 },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`rounded-xl border p-4 ${
              tile.danger
                ? "border-danger/30 bg-danger-bg"
                : "border-border bg-surface"
            }`}
          >
            <div
              className={`text-2xl font-semibold ${tile.danger ? "text-danger" : "text-foreground"}`}
            >
              {tile.value}
            </div>
            <div className="text-sm text-muted mt-1">{tile.label}</div>
          </div>
        ))}
      </div>

      {stats.byStatus.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-sm text-muted mb-2">פילוח לפי סטטוס</div>
          <div className="flex flex-wrap gap-2">
            {stats.byStatus.map((row) => (
              <span
                key={row.status}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm"
              >
                <span>{row.status}</span>
                <span className="text-muted">{row.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
