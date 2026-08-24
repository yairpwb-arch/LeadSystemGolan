"use client";

import { deleteLeadAction } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

export default function DeleteLeadButton({ leadId }: { leadId: number }) {
  return (
    <form
      action={deleteLeadAction}
      onSubmit={(event) => {
        if (!confirm("למחוק את הליד? הפעולה בלתי הפיכה.")) {
          event.preventDefault();
        }
      }}
      className="inline-flex"
    >
      <input type="hidden" name="id" value={leadId} />
      <SubmitButton pendingText="מוחק..." className="text-sm text-danger hover:underline">
        מחיקה
      </SubmitButton>
    </form>
  );
}
