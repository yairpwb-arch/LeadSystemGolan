export const INTEREST_OPTIONS = [
  "קו חדש",
  "שדרוג קווים",
  "אינטרנט",
  "טריפל",
  "טלוויזיה",
] as const;

export type LeadInterest = (typeof INTEREST_OPTIONS)[number];

export const STATUS_OPTIONS = [
  "נקבעה שיחה",
  "מתלבט",
  "אין מענה",
  "לא רלוונטי",
  "נסגר-לקוח",
] as const;

export type LeadStatus = (typeof STATUS_OPTIONS)[number];

// סטטוסים שבהם ליד כבר לא צריך מעקב יזום
export const CLOSED_STATUSES: LeadStatus[] = ["לא רלוונטי", "נסגר-לקוח"];

export const STATUS_COLORS: Record<
  LeadStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  "נקבעה שיחה": {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/40",
    dot: "bg-blue-500",
  },
  "מתלבט": {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/40",
    dot: "bg-amber-500",
  },
  "אין מענה": {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    border: "border-orange-500/40",
    dot: "bg-orange-500",
  },
  "לא רלוונטי": {
    bg: "bg-slate-500/15",
    text: "text-slate-300",
    border: "border-slate-500/40",
    dot: "bg-slate-400",
  },
  "נסגר-לקוח": {
    bg: "bg-green-500/15",
    text: "text-green-300",
    border: "border-green-500/40",
    dot: "bg-green-500",
  },
};

export interface Lead {
  id: number;
  full_name: string;
  phone: string | null;
  customer_number: string | null;
  source: string | null; // מוצג למשתמש כ"מעוניין"
  status: LeadStatus;
  follow_up_at: string | null; // 'YYYY-MM-DD HH:MM:SS'
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
