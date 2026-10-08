import { serveAsset } from "@/lib/assets";

// Uploaded profile photo (Admin → Profile & skills).
export function GET() {
  return serveAsset("avatar");
}
