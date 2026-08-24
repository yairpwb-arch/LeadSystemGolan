"use client";

import { useRef } from "react";
import { createLeadAction, updateLeadAction } from "@/lib/actions";
import { SOURCE_OPTIONS, STATUS_OPTIONS, type Lead } from "@/lib/types";

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
        onClose={(event) => event.stopPropagation()}
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
              defaultValue={lead?.full_name ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">טלפון</label>
            <input
              name="phone"
              defaultValue={lead?.phone ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">מקור</label>
              <select
                name="source"
                defaultValue={lead?.source ?? ""}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              >
                <option value="">בחרו מקור</option>
                {SOURCE_OPTIONS.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">סטטוס</label>
              <select
                name="status"
                defaultValue={lead?.status ?? STATUS_OPTIONS[0]}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">
              תאריך מעקב הבא
            </label>
            <input
              type="date"
              name="follow_up_date"
              defaultValue={lead?.follow_up_date ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">הערות</label>
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
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-2 text-sm text-white font-medium hover:bg-brand-hover"
            >
              {isEdit ? "שמירה" : "הוספת ליד"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
