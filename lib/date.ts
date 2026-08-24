const TIMEZONE = "Asia/Jerusalem";

// "היום" לפי שעון ישראל, בפורמט YYYY-MM-DD (תואם לעמודת DATE ולשדות <input type="date">).
export function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

// follow_up_at מגיע מ-Postgres כטקסט בפורמט "YYYY-MM-DD HH:MM:SS" (ללא אזור זמן,
// נשמר כפי שהוזן - שעון ישראל "נאיבי"), כך שאין צורך בהמרות אזור זמן כאן.
export function isOverdue(followUpAt: string | null): boolean {
  if (!followUpAt) return false;
  return followUpAt.slice(0, 10) < todayISODate();
}

export function isDueToday(followUpAt: string | null): boolean {
  if (!followUpAt) return false;
  return followUpAt.slice(0, 10) === todayISODate();
}

export function formatDateHe(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

// ממיר "YYYY-MM-DD HH:MM:SS" (מה-DB) ל-"YYYY-MM-DDTHH:MM" (ל-<input type="datetime-local">)
export function toDatetimeLocalValue(value: string | null): string {
  if (!value) return "";
  return value.slice(0, 16).replace(" ", "T");
}

// ממיר "YYYY-MM-DD HH:MM:SS" לתצוגה ידידותית: "24.08.2026 14:00"
export function formatDateTimeHe(value: string | null): string {
  if (!value) return "—";
  const [datePart, timePart] = value.split(/[ T]/);
  const [year, month, day] = datePart.split("-");
  const time = timePart ? timePart.slice(0, 5) : "";
  return `${day}.${month}.${year}${time ? ` ${time}` : ""}`;
}
