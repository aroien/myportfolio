"use server";

import { headers } from "next/headers";
import { getAdmin } from "@/lib/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { PageViewModel } from "@/lib/models";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|monitor/i;
const recent = new Map<string, number[]>();

/**
 * Counts one homepage view. `newVisitor` is true the first time a browser
 * visits on a given day (tracked with a date in its localStorage, not an ID).
 * Skips bots, the logged-in admin, and floods from a single IP.
 */
export async function recordVisit(newVisitor: boolean) {
  if (!isDbConfigured()) return;
  const h = await headers();
  if (BOT.test(h.get("user-agent") ?? "")) return;
  if (await getAdmin()) return;

  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (hits.length >= 20) return;
  hits.push(now);
  recent.set(ip, hits);

  try {
    await connectDb();
    const day = new Date().toISOString().slice(0, 10);
    await PageViewModel.updateOne(
      { day },
      { $inc: { views: 1, visitors: newVisitor ? 1 : 0 } },
      { upsert: true },
    );
  } catch (err) {
    console.error("[analytics] failed to record visit", err);
  }
}
