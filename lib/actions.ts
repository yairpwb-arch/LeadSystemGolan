"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "./auth";
import {
  createLead,
  deleteLead,
  updateFollowUpAt,
  updateLead,
  updateStatus,
  type NewLeadInput,
} from "./db";
import { STATUS_OPTIONS, type LeadStatus } from "./types";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");

  if (!checkPassword(password)) {
    redirect("/login?error=1");
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

function readLeadForm(formData: FormData): NewLeadInput {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const customer_number = String(formData.get("customer_number") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const follow_up_at = String(formData.get("follow_up_at") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!full_name) {
    throw new Error("שם מלא הוא שדה חובה");
  }

  return {
    full_name,
    phone: phone || null,
    customer_number: customer_number || null,
    source: source || null,
    follow_up_at: follow_up_at || null,
    notes: notes || null,
  };
}

export async function createLeadAction(formData: FormData): Promise<void> {
  const input = readLeadForm(formData);
  await createLead(input);
  revalidatePath("/");
}

export async function updateLeadAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("מזהה ליד לא תקין");
  const input = readLeadForm(formData);
  await updateLead(id, input);
  revalidatePath("/");
}

export async function quickUpdateFollowUpAtAction(
  formData: FormData
): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("מזהה ליד לא תקין");
  const followUpAt = String(formData.get("follow_up_at") ?? "").trim();
  await updateFollowUpAt(id, followUpAt || null);
  revalidatePath("/");
}

export async function quickUpdateStatusAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("מזהה ליד לא תקין");
  const status = String(formData.get("status") ?? "");
  if (!(STATUS_OPTIONS as readonly string[]).includes(status)) {
    throw new Error("סטטוס לא תקין");
  }
  await updateStatus(id, status as LeadStatus);
  revalidatePath("/");
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) throw new Error("מזהה ליד לא תקין");
  await deleteLead(id);
  revalidatePath("/");
}
