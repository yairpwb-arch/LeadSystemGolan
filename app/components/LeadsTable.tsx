import type { Lead } from "@/lib/types";
import { isOverdue } from "@/lib/date";
import AutoSubmitFollowUpAt from "./AutoSubmitFollowUpAt";
import AutoSubmitStatus from "./AutoSubmitStatus";
import DeleteLeadButton from "./DeleteLeadButton";
import LeadFormDialog from "./LeadFormDialog";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <p className="p-6 text-sm text-muted text-center rounded-xl border border-border bg-surface">
        לא נמצאו לידים תואמים
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-start text-muted">
            <th className="p-3 text-start font-medium">שם</th>
            <th className="p-3 text-start font-medium">טלפון</th>
            <th className="p-3 text-start font-medium">מס&apos; לקוח</th>
            <th className="p-3 text-start font-medium">מעוניין</th>
            <th className="p-3 text-start font-medium">סטטוס</th>
            <th className="p-3 text-start font-medium">מתי לחזור אליו</th>
            <th className="p-3 text-start font-medium">הערות</th>
            <th className="p-3 text-start font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const overdue = isOverdue(lead.follow_up_at);
            return (
              <tr
                key={lead.id}
                className={`border-b border-border last:border-0 ${
                  overdue ? "bg-danger-bg" : ""
                }`}
              >
                <td className="p-3 font-medium whitespace-nowrap">
                  <LeadFormDialog
                    lead={lead}
                    trigger={
                      <button className="hover:underline text-start">
                        {lead.full_name}
                      </button>
                    }
                  />
                </td>
                <td className="p-3 whitespace-nowrap">{lead.phone ?? "—"}</td>
                <td className="p-3 whitespace-nowrap">
                  {lead.customer_number ?? "—"}
                </td>
                <td className="p-3 whitespace-nowrap">{lead.source ?? "—"}</td>
                <td className="p-3">
                  <AutoSubmitStatus
                    key={`${lead.id}:${lead.status}`}
                    leadId={lead.id}
                    value={lead.status}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <AutoSubmitFollowUpAt
                      key={`${lead.id}:${lead.follow_up_at}`}
                      leadId={lead.id}
                      value={lead.follow_up_at}
                    />
                    {overdue && (
                      <span className="text-danger text-xs font-medium">
                        באיחור
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 max-w-[220px] truncate text-muted">
                  {lead.notes || "—"}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <DeleteLeadButton leadId={lead.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
