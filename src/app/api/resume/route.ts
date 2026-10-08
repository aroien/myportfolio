import { serveAsset } from "@/lib/assets";

// Uploaded résumé PDF (Admin → Profile & skills).
export function GET() {
  return serveAsset("resume");
}
