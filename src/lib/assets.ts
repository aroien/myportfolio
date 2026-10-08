import "server-only";
import { connection } from "next/server";
import { connectDb, isDbConfigured } from "./db";
import { AssetModel } from "./models";

type StoredAsset = { data: Buffer | { buffer: ArrayBuffer }; contentType: string; filename?: string };

/**
 * Serves a file stored in MongoDB (see AssetModel). Pages link to it with a
 * ?v=<timestamp> query, so every upload has a new URL and responses can be
 * cached forever.
 */
export async function serveAsset(key: string) {
  await connection();
  if (!isDbConfigured()) return new Response("Not found", { status: 404 });

  await connectDb();
  const asset = await AssetModel.findOne({ key }).lean<StoredAsset>();
  if (!asset) return new Response("Not found", { status: 404 });

  const bytes = Buffer.isBuffer(asset.data) ? asset.data : Buffer.from(asset.data.buffer);
  const headers: Record<string, string> = {
    "Content-Type": asset.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };
  if (asset.filename) {
    headers["Content-Disposition"] = `inline; filename="${asset.filename.replace(/[^\w.-]/g, "-")}"`;
  }
  return new Response(new Uint8Array(bytes), { headers });
}
