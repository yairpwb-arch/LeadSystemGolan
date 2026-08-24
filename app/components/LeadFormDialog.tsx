"use client";

import { useRef } from "react";
import { createLeadAction, updateLeadAction } from "@/lib/actions";
import { INTEREST_OPTIONS, type Lead } from "@/lib/types";
import { toDatetimeLocalValue } from "@/lib/date";
import SubmitButton from "./SubmitButton";

export default function LeadFormDialog({
  lead,
  trigger,
}: {
  lead?: Lead;
  trigger: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEdit = Boolean(lead);
  const action = isEdit ? updateLeadAction : createLeadAction;

  return (
    <>
      <span onClick={() => dialogRef.current?.showModal()}>{trigger}</span>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-0 backdrop:bg-black/40"
      >
        <form
          action={async (formData) => {
            await action(formData);
            dialogRef.current?.close();
          }}
          className="p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">
            {isEdit ? "עריכת ליד" : "ליד חדש"}
          </h2>

          {isEdit && <input type="hidden" name="id" value={lead!.id} />}

          <div>
            <label className="block text-sm text-muted mb-1">שם מלא</label>
            <input
              name="full_name"
              required
              autoFocus
              defaultValue={lead?.full_name ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">מספר טלפון</label>
            <input
              name="phone"
              type="tel"
              required
              defaultValue={lead?.phone ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">
              מספר לקוח <span className="text-muted">(אופציונלי)</span>
            </label>
            <input
              name="customer_number"
              defaultValue={lead?.customer_number ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">
              מתי לחזור אליו
            </label>
            <input
              type="datetime-local"
              name="follow_up_at"
              required
              defaultValue={toDatetimeLocalValue(lead?.follow_up_at ?? null)}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">מעוניין</label>
            <select
              name="source"
              required
              defaultValue={lead?.source ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            >
              <option value="" disabled>
                בחרו
              </option>
              {INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">הערה</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={lead?.notes ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg px-4 py-2 text-sm text-muted hover:bg-background"
            >
              ביטול
            </button>
            <SubmitButton
              pendingText={isEdit ? "שומר..." : "מוסיף..."}
              className="rounded-lg bg-brand px-4 py-2 text-sm text-white font-medium hover:bg-brand-hover"
            >
              {isEdit ? "שמירה" : "הוספת ליד"}
            </SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
