"use client";

import { quickUpdateStatusAction } from "@/lib/actions";
import { STATUS_OPTIONS } from "@/lib/types";

export default function AutoSubmitStatus({
  leadId,
  value,
}: {
  leadId: number;
  value: string;
}) {
  return (
    <form action={quickUpdateStatusAction} className="inline-flex">
      <input type="hidden" name="id" value={leadId} />
      <select
        name="status"
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-border px-2 py-1 text-sm bg-surface"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </form>
  );
}
