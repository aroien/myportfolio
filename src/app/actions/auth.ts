"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, endSession, startSession } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

// Best-effort brute-force throttle (per server instance).
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > now) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  let ok = false;
  try {
    ok = checkCredentials(email, password);
  } catch (err) {
    return { error: (err as Error).message };
  }

  if (!ok) {
    const count = entry && entry.until > now ? entry.count + 1 : 1;
    attempts.set(ip, { count, until: now + LOCK_MS });
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Invalid email or password." };
  }

  attempts.delete(ip);
  await startSession(email);
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
