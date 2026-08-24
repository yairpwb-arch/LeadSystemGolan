"use client";

import { quickUpdateFollowUpDateAction } from "@/lib/actions";

export default function AutoSubmitDate({
  leadId,
  value,
}: {
  leadId: number;
  value: string | null;
}) {
  return (
    <form action={quickUpdateFollowUpDateAction} className="inline-flex">
      <input type="hidden" name="id" value={leadId} />
      <input
        type="date"
        name="follow_up_date"
        defaultValue={value ?? ""}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-border px-2 py-1 text-sm"
      />
    </form>
  );
}
