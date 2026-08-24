import type { Lead } from "@/lib/types";
import { formatDateTimeHe, isOverdue } from "@/lib/date";
import AutoSubmitFollowUpAt from "./AutoSubmitFollowUpAt";
import AutoSubmitStatus from "./AutoSubmitStatus";
import LeadFormDialog from "./LeadFormDialog";

export default function TodayFollowUps({ leads }: { leads: Lead[] }) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">מי שצריך לחזור אליו היום</h2>
        <p className="text-sm text-muted mt-0.5">
          כולל לידים שעברו את התאריך שנקבע ולא טופלו (מסומנים באדום)
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="p-6 text-sm text-muted text-center">
          אין לידים שממתינים למעקב היום 🎉
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {leads.map((lead) => {
            const overdue = isOverdue(lead.follow_up_at);
            return (
              <li
                key={lead.id}
                className={`p-4 flex flex-wrap items-center gap-3 ${
                  overdue ? "bg-danger-bg" : ""
                }`}
              >
                <div className="min-w-[160px] flex-1">
                  <LeadFormDialog
                    lead={lead}
                    trigger={
                      <button className="font-medium hover:underline text-start">
                        {lead.full_name}
                      </button>
                    }
                  />
                  {lead.phone && (
                    <div className="text-sm text-muted">{lead.phone}</div>
                  )}
                </div>

                <span
                  className={`text-sm ${overdue ? "text-danger font-medium" : "text-muted"}`}
                >
                  {overdue ? "באיחור מ־" : "נקבע ל־"}
                  {formatDateTimeHe(lead.follow_up_at)}
                </span>

                <AutoSubmitStatus
                  key={`${lead.id}:${lead.status}`}
                  leadId={lead.id}
                  value={lead.status}
                />
                <AutoSubmitFollowUpAt
                  key={`${lead.id}:${lead.follow_up_at}`}
                  leadId={lead.id}
                  value={lead.follow_up_at}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
