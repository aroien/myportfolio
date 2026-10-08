import { connection } from "next/server";
import { connectDb, isDbConfigured } from "@/lib/db";
import { AssetModel } from "@/lib/models";

// Serves the uploaded profile photo. The page links to /api/avatar?v=<timestamp>,
// so each upload gets a new URL and the response can be cached indefinitely.
export async function GET() {
  await connection();
  if (!isDbConfigured()) return new Response("Not found", { status: 404 });

  await connectDb();
  const asset = await AssetModel.findOne({ key: "avatar" }).lean<{ data: { buffer: ArrayBuffer } | Buffer; contentType: string }>();
  if (!asset) return new Response("Not found", { status: 404 });

  const bytes = Buffer.isBuffer(asset.data) ? asset.data : Buffer.from((asset.data as { buffer: ArrayBuffer }).buffer);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
