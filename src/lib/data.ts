import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDb, isDbConfigured } from "./db";
import { MessageModel, PageViewModel, ProfileModel, collectionModels } from "./models";
import { requireAdmin } from "./auth";
import { seed } from "./seed";
import type { CollectionName, Message, Portfolio, Profile } from "./types";

export const PORTFOLIO_TAG = "portfolio";

/** Convert a lean Mongoose doc into a plain, serializable object with `id`. */
function plain<T>(doc: Record<string, unknown>): T {
  const { _id, createdAt, updatedAt, key, ...rest } = doc;
  void key;
  void updatedAt;
  return JSON.parse(
    JSON.stringify({ id: String(_id), ...rest, ...(createdAt ? { createdAt } : {}) }),
  ) as T;
}

function withProfileDefaults(doc: Record<string, unknown> | null): Profile {
  if (!doc) return seed.profile;
  const p = plain<Partial<Profile>>(doc);
  return {
    ...seed.profile,
    ...p,
    socials: { ...p.socials },
    stats: p.stats ?? [],
    skills: p.skills ?? [],
    roles: p.roles ?? [],
  };
}

async function readCollection<T>(name: CollectionName) {
  const docs = await collectionModels[name].find().sort({ order: 1, createdAt: -1 }).lean();
  return docs.map((d) => plain<T>(d as Record<string, unknown>));
}

/** Public, cached read of everything the site renders. Refreshed via updateTag(PORTFOLIO_TAG). */
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";
  cacheTag(PORTFOLIO_TAG);

  if (!isDbConfigured()) {
    cacheLife("max");
    return seed;
  }
  try {
    await connectDb();
    const [profile, projects, experience, publications] = await Promise.all([
      ProfileModel.findOne({ key: "main" }).lean(),
      readCollection<Portfolio["projects"][number]>("projects"),
      readCollection<Portfolio["experience"][number]>("experience"),
      readCollection<Portfolio["publications"][number]>("publications"),
    ]);
    cacheLife("days");
    return {
      profile: withProfileDefaults(profile as Record<string, unknown> | null),
      projects,
      experience,
      publications,
    };
  } catch (err) {
    // Keep the public site up if the database is unreachable; retry soon.
    console.error("[portfolio] database read failed, serving seed content", err);
    cacheLife("minutes");
    return seed;
  }
}

// ---- Admin reads (uncached, always fresh, require a session) ----

export async function adminGetProfile() {
  await requireAdmin();
  await connectDb();
  return withProfileDefaults((await ProfileModel.findOne({ key: "main" }).lean()) as Record<string, unknown> | null);
}

export async function adminGetCollection<T>(name: CollectionName) {
  await requireAdmin();
  await connectDb();
  return readCollection<T>(name);
}

export async function adminGetMessages() {
  await requireAdmin();
  await connectDb();
  const docs = await MessageModel.find().sort({ createdAt: -1 }).limit(500).lean();
  return docs.map((d) => plain<Message>(d as Record<string, unknown>));
}

export async function adminGetOverview() {
  await requireAdmin();
  await connectDb();
  const [projects, experience, publications, messages, unread, hasProfile] = await Promise.all([
    collectionModels.projects.countDocuments(),
    collectionModels.experience.countDocuments(),
    collectionModels.publications.countDocuments(),
    MessageModel.countDocuments(),
    MessageModel.countDocuments({ read: false }),
    ProfileModel.exists({ key: "main" }),
  ]);
  return { projects, experience, publications, messages, unread, hasProfile: Boolean(hasProfile) };
}

export type VisitDay = { day: string; views: number; visitors: number };

/** Daily visit totals for the admin dashboard (last 30 days, oldest first, gaps filled). */
export async function adminGetVisitStats() {
  await requireAdmin();
  await connectDb();
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    days.push(d.toISOString().slice(0, 10));
  }
  const [docs, allTime] = await Promise.all([
    PageViewModel.find({ day: { $gte: days[0] } }).lean<VisitDay[]>(),
    PageViewModel.aggregate<{ views: number }>([{ $group: { _id: null, views: { $sum: "$views" } } }]),
  ]);
  const byDay = new Map(docs.map((d) => [d.day, d]));
  const series: VisitDay[] = days.map((day) => ({ day, views: byDay.get(day)?.views ?? 0, visitors: byDay.get(day)?.visitors ?? 0 }));
  const sum = (list: VisitDay[], k: "views" | "visitors") => list.reduce((n, d) => n + d[k], 0);
  return {
    series,
    today: series[series.length - 1],
    week: { views: sum(series.slice(-7), "views"), visitors: sum(series.slice(-7), "visitors") },
    month: { views: sum(series, "views"), visitors: sum(series, "visitors") },
    allTimeViews: allTime[0]?.views ?? 0,
  };
}
