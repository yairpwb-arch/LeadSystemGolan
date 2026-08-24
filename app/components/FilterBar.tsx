"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { SOURCE_OPTIONS, STATUS_OPTIONS } from "@/lib/types";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  function onSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 300);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        placeholder="חיפוש לפי שם או טלפון..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(event) => onSearchChange(event.target.value)}
        className="flex-1 min-w-[180px] rounded-lg border border-border px-3 py-2 text-sm"
      />

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
        <option value="">כל המקורות</option>
        {SOURCE_OPTIONS.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? "follow_up_asc"}
        onChange={(event) => updateParam("sort", event.target.value)}
        className="rounded-lg border border-border px-3 py-2 text-sm bg-surface"
      >
        <option value="follow_up_asc">מיון: תאריך מעקב (קרוב קודם)</option>
        <option value="follow_up_desc">מיון: תאריך מעקב (רחוק קודם)</option>
        <option value="created_desc">מיון: נוצר לאחרונה</option>
        <option value="name_asc">מיון: שם</option>
      </select>
    </div>
  );
}
