export const SOURCE_OPTIONS = [
  "קהילת וואטסאפ",
  "אינסטגרם",
  "פייסבוק",
  "מדריך",
  "הפניה",
  "אחר",
] as const;

export type LeadSource = (typeof SOURCE_OPTIONS)[number];

export const STATUS_OPTIONS = [
  "חדש",
  "נקבעה שיחה",
  "מתלבט",
  "לא רלוונטי",
  "אין מענה",
  "נסגר-לקוח",
] as const;

export type LeadStatus = (typeof STATUS_OPTIONS)[number];

// סטטוסים שבהם ליד כבר לא צריך מעקב יזום
export const CLOSED_STATUSES: LeadStatus[] = ["לא רלוונטי", "נסגר-לקוח"];

export interface Lead {
  id: number;
  full_name: string;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  follow_up_date: string | null; // 'YYYY-MM-DD'
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadStats {
  total: number;
  dueToday: number;
  overdue: number;
  byStatus: { status: string; count: number }[];
}

export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  sort?: "follow_up_asc" | "follow_up_desc" | "created_desc" | "name_asc";
}
