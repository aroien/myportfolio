"use server";

import { connectDb, isDbConfigured } from "@/lib/db";
import { MessageModel } from "@/lib/models";

export type ContactState = { ok?: boolean; error?: string } | undefined;

const recent = new Map<string, number>();

async function notifyByEmail(msg: { name: string; email: string; subject: string; body: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to,
        reply_to: msg.email,
        subject: `Portfolio: ${msg.subject || "New message"} — ${msg.name}`,
        text: `${msg.name} <${msg.email}>\n\n${msg.body}`,
      }),
    });
  } catch (err) {
    console.error("[contact] email notification failed", err);
  }
}

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (String(form.get("website") ?? "")) return { ok: true };

  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const subject = String(form.get("subject") ?? "").trim().slice(0, 200);
  const body = String(form.get("message") ?? "").trim().slice(0, 5000);

  if (!name || !email || !body) return { error: "Please fill in your name, email and message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };

  const last = recent.get(email);
  if (last && Date.now() - last < 30_000) return { error: "You just sent a message. Please wait a moment." };
  recent.set(email, Date.now());

  if (!isDbConfigured()) return { error: "The contact form isn't connected yet. Please email me directly." };

  try {
    await connectDb();
    await MessageModel.create({ name, email, subject, body });
  } catch (err) {
    console.error("[contact] save failed", err);
    return { error: "Something went wrong. Please email me directly." };
  }
  await notifyByEmail({ name, email, subject, body });
  return { ok: true };
}
