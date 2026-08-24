"use client";

import { useFormStatus } from "react-dom";
import { quickUpdateFollowUpAtAction } from "@/lib/actions";
import { toDatetimeLocalValue } from "@/lib/date";

function DateTimeInput({ value }: { value: string | null }) {
  const { pending } = useFormStatus();
  return (
    <input
      type="datetime-local"
      name="follow_up_at"
      defaultValue={toDatetimeLocalValue(value)}
      disabled={pending}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-md border border-border px-2 py-1 text-sm disabled:opacity-50"
    />
  );
}

export default function AutoSubmitFollowUpAt({
  leadId,
  value,
}: {
  leadId: number;
  value: string | null;
}) {
  return (
    <form action={quickUpdateFollowUpAtAction} className="inline-flex">
      <input type="hidden" name="id" value={leadId} />
      <DateTimeInput value={value} />
    </form>
  );
}
