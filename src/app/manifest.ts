import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M Mehedi — Portfolio",
    short_name: "M. Mehedi",
    start_url: "/",
    display: "browser",
    background_color: "#f5f7fb",
    theme_color: "#ea580c",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
