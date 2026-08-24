"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { quickUpdateStatusAction } from "@/lib/actions";
import { STATUS_COLORS, STATUS_OPTIONS, type LeadStatus } from "@/lib/types";

function StatusSelect({
  value,
  onLocalChange,
}: {
  value: LeadStatus;
  onLocalChange: (status: LeadStatus) => void;
}) {
  const { pending } = useFormStatus();
  const colors = STATUS_COLORS[value] ?? STATUS_COLORS[STATUS_OPTIONS[0]];

  return (
    <select
      name="status"
      value={value}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as LeadStatus;
        onLocalChange(next);
        event.currentTarget.form?.requestSubmit();
      }}
      className={`rounded-md border px-2 py-1 text-sm font-medium disabled:opacity-50 ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {STATUS_OPTIONS.map((status) => (
        <option
          key={status}
          value={status}
          style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}
        >
          {status}
        </option>
      ))}
    </select>
  );
}

export default function AutoSubmitStatus({
  leadId,
  value,
}: {
  leadId: number;
  value: LeadStatus;
}) {
  const [status, setStatus] = useState<LeadStatus>(value);

  return (
    <form action={quickUpdateStatusAction} className="inline-flex">
      <input type="hidden" name="id" value={leadId} />
      <StatusSelect value={status} onLocalChange={setStatus} />
    </form>
  );
}
