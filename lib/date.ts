const TIMEZONE = "Asia/Jerusalem";

// "היום" לפי שעון ישראל, בפורמט YYYY-MM-DD (תואם לעמודת DATE ולשדות <input type="date">).
export function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

export function isOverdue(followUpDate: string | null): boolean {
  if (!followUpDate) return false;
  return followUpDate < todayISODate();
}

export function isDueToday(followUpDate: string | null): boolean {
  return followUpDate === todayISODate();
}

export function formatDateHe(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}
