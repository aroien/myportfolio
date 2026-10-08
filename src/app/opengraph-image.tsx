import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/data";

export const alt = "Mohiuddin Mehedi — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Shown when the site link is shared (LinkedIn, X, Slack, iMessage…).
// Uses the same cached profile data as the homepage, so edits in /admin update it.
export default async function OpengraphImage() {
  const { profile } = await getPortfolio();
  const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mmehedi.me").host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #faf8f4 0%, #fdf3e7 60%, #ffedd5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fb923c" />
                <stop offset="1" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="15" fill="url(#g)" />
            <path d="M29 47 40.5 17 52 47" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 47 23.5 17 35 47" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#0f172a" }}>{host}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.05 }}>{profile.name}</div>
          <div style={{ fontSize: 40, fontWeight: 500, color: "#ea580c", marginTop: 18 }}>{profile.headline}</div>
          <div style={{ fontSize: 28, color: "#475569", marginTop: 26, maxWidth: 900, lineHeight: 1.4 }}>{profile.intro}</div>
        </div>

        <div style={{ display: "flex", height: 8, width: 160, borderRadius: 8, background: "linear-gradient(90deg, #fb923c, #ea580c)" }} />
      </div>
    ),
    size,
  );
}
