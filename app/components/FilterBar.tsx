"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { INTEREST_OPTIONS, STATUS_OPTIONS } from "@/lib/types";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  function onSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 300);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[180px]">
        <input
          type="search"
          placeholder="חיפוש לפי שם או טלפון..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        {isPending && (
          <span
            aria-hidden="true"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-muted border-t-transparent animate-spin"
          />
        )}
      </div>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(event) => updateParam("status", event.target.value)}
        className="rounded-lg border border-border px-3 py-2 text-sm bg-surface"
      >
        <option value="">כל הסטטוסים</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("source") ?? ""}
        onChange={(event) => updateParam("source", event.target.value)}
        className="rounded-lg border border-border px-3 py-2 text-sm bg-surface"
      >
        <option value="">כל מה שמעוניינים בו</option>
        {INTEREST_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? "follow_up_asc"}
        onChange={(event) => updateParam("sort", event.target.value)}
        className="rounded-lg border border-border px-3 py-2 text-sm bg-surface"
      >
        <option value="follow_up_asc">מיון: מועד חזרה (קרוב קודם)</option>
        <option value="follow_up_desc">מיון: מועד חזרה (רחוק קודם)</option>
        <option value="created_desc">מיון: נוצר לאחרונה</option>
        <option value="name_asc">מיון: שם</option>
      </select>
    </div>
  );
}
