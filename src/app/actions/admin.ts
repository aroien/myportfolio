"use server";

import { isValidObjectId } from "mongoose";
import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { collections, isCollection, parseCollectionForm, splitLines, splitTags } from "@/lib/collections";
import { PORTFOLIO_TAG } from "@/lib/data";
import { connectDb } from "@/lib/db";
import { AssetModel, MessageModel, ProfileModel, collectionModels } from "@/lib/models";
import { seed } from "@/lib/seed";
import type { CollectionName } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string; errors?: Record<string, string>; savedAt?: number } | undefined;

/** Expire the public site's cache and refresh the admin view. */
function publish() {
  updateTag(PORTFOLIO_TAG);
  refresh();
}

function assertCollection(name: string): asserts name is CollectionName {
  if (!isCollection(name)) throw new Error("Unknown collection");
}

function assertId(id: string) {
  if (!isValidObjectId(id)) throw new Error("Invalid id");
}

// ---------- Collections (projects / experience / publications) ----------

export async function saveItem(
  collection: string,
  id: string | null,
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  assertCollection(collection);
  const { data, errors } = parseCollectionForm(collection, form);
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", errors };

  try {
    await connectDb();
    const Model = collectionModels[collection];
    if (id) {
      assertId(id);
      await Model.updateOne({ _id: id }, { $set: data });
    } else {
      const first = await Model.findOne().sort({ order: 1 }).select("order").lean<{ order?: number }>();
      await Model.create({ ...data, order: (first?.order ?? 0) - 1 });
    }
  } catch (err) {
    return { error: (err as Error).message };
  }
  publish();
  return { ok: true, savedAt: Date.now() };
}

export async function deleteItem(collection: string, id: string) {
  await requireAdmin();
  assertCollection(collection);
  assertId(id);
  await connectDb();
  await collectionModels[collection].deleteOne({ _id: id });
  publish();
}

/** Persist a full ordering after drag/up/down in the admin list. */
export async function reorderItems(collection: string, ids: string[]) {
  await requireAdmin();
  assertCollection(collection);
  ids.forEach(assertId);
  await connectDb();
  await collectionModels[collection].bulkWrite(
    ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })),
  );
  publish();
}

// ---------- Profile ----------

function parseStats(value: string) {
  return splitLines(value).map((line) => {
    const [v, ...label] = line.split("|");
    return { value: v.trim(), label: label.join("|").trim() };
  }).filter((s) => s.value && s.label);
}

function parseSkills(value: string) {
  return splitLines(value).map((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return { category: "Skills", items: splitTags(line) };
    return { category: line.slice(0, idx).trim(), items: splitTags(line.slice(idx + 1)) };
  }).filter((g) => g.items.length);
}

export async function saveProfile(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const s = (k: string) => String(form.get(k) ?? "").trim();

  const errors: Record<string, string> = {};
  if (!s("name")) errors.name = "Name is required";
  if (!s("headline")) errors.headline = "Headline is required";
  if (s("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s("email"))) errors.email = "Invalid email";
  if (Object.keys(errors).length) return { error: "Please fix the highlighted fields.", errors };

  const update = {
    name: s("name"),
    headline: s("headline"),
    roles: splitLines(s("roles")),
    intro: s("intro"),
    about: s("about"),
    location: s("location"),
    email: s("email"),
    available: form.get("available") === "on",
    availabilityText: s("availabilityText"),
    socials: {
      github: s("github"),
      linkedin: s("linkedin"),
      scholar: s("scholar"),
      orcid: s("orcid"),
      researchgate: s("researchgate"),
      twitter: s("twitter"),
    },
    stats: parseStats(s("stats")),
    skills: parseSkills(s("skills")),
  };

  try {
    await connectDb();
    await ProfileModel.updateOne({ key: "main" }, { $set: update }, { upsert: true });
  } catch (err) {
    return { error: (err as Error).message };
  }
  publish();
  return { ok: true, savedAt: Date.now() };
}

// ---------- Profile photo ----------

const MAX_AVATAR_BYTES = 900 * 1024;

/** Detect the real image type from the file's first bytes. */
function sniffImage(buf: Buffer) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function uploadAvatar(form: FormData): Promise<{ error?: string; url?: string }> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  if (file.size > MAX_AVATAR_BYTES) return { error: "Image is too large (max 900 KB after resizing)." };

  const data = Buffer.from(await file.arrayBuffer());
  const contentType = sniffImage(data);
  if (!contentType) return { error: "Please upload a JPG, PNG or WebP image." };

  const url = `/api/avatar?v=${Date.now()}`;
  try {
    await connectDb();
    await AssetModel.updateOne({ key: "avatar" }, { $set: { data, contentType, size: data.length } }, { upsert: true });
    await ProfileModel.updateOne({ key: "main" }, { $set: { avatarUrl: url } }, { upsert: true });
  } catch (err) {
    return { error: (err as Error).message };
  }
  publish();
  return { url };
}

export async function removeAvatar() {
  await requireAdmin();
  await connectDb();
  await AssetModel.deleteOne({ key: "avatar" });
  await ProfileModel.updateOne({ key: "main" }, { $set: { avatarUrl: "" } });
  publish();
}

// ---------- Résumé ----------

// Vercel limits request bodies to 4.5 MB, so keep uploads under that.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

const safeName = (name: string) => name.trim().replace(/\s+/g, "-").replace(/[^\w.-]/g, "") || "Resume";

export async function uploadResume(form: FormData): Promise<{ error?: string; url?: string }> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a PDF to upload." };
  if (file.size > MAX_RESUME_BYTES) return { error: "PDF is too large (max 4 MB). Try exporting it with smaller images." };

  const data = Buffer.from(await file.arrayBuffer());
  if (data.subarray(0, 5).toString("ascii") !== "%PDF-") return { error: "That file isn't a PDF." };

  const url = `/api/resume?v=${Date.now()}`;
  try {
    await connectDb();
    const profile = await ProfileModel.findOne({ key: "main" }).select("name").lean<{ name?: string }>();
    const filename = `${safeName(profile?.name ?? "")}-Resume.pdf`;
    await AssetModel.updateOne(
      { key: "resume" },
      { $set: { data, contentType: "application/pdf", filename, size: data.length } },
      { upsert: true },
    );
    await ProfileModel.updateOne({ key: "main" }, { $set: { resumeUrl: url } }, { upsert: true });
  } catch (err) {
    return { error: (err as Error).message };
  }
  publish();
  return { url };
}

/** Use an external link (or a /public path) instead of an uploaded file. */
export async function setResumeLink(link: string): Promise<{ error?: string }> {
  await requireAdmin();
  const url = link.trim();
  if (url && !/^(https?:\/\/|\/)/.test(url)) return { error: "Link must start with https:// or /" };
  await connectDb();
  await AssetModel.deleteOne({ key: "resume" });
  await ProfileModel.updateOne({ key: "main" }, { $set: { resumeUrl: url } }, { upsert: true });
  publish();
  return {};
}

export async function removeResume() {
  await setResumeLink("");
}

// ---------- Messages ----------

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  assertId(id);
  await connectDb();
  await MessageModel.updateOne({ _id: id }, { $set: { read } });
  refresh();
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  assertId(id);
  await connectDb();
  await MessageModel.deleteOne({ _id: id });
  refresh();
}

// ---------- Sample content ----------

/** Fill empty collections (and a missing profile) with the starter content. */
export async function loadSampleContent() {
  await requireAdmin();
  await connectDb();
  if (!(await ProfileModel.exists({ key: "main" }))) {
    await ProfileModel.create({ key: "main", ...seed.profile });
  }
  for (const name of Object.keys(collections) as CollectionName[]) {
    const Model = collectionModels[name];
    if ((await Model.countDocuments()) === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await Model.insertMany(seed[name].map(({ id, ...rest }) => rest));
    }
  }
  publish();
}
