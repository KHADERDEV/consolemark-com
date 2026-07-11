import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Console Mark",
    short_name: "ConsoleMark",
    description: "The trusted marketplace for Play Console Publishers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#00e5ff",
    categories: ["business", "productivity", "shopping"],
    icons: [
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/consolemark-logo-00e5ff.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Rent Marketplace",
        short_name: "Marketplace",
        description: "Browse Play Consoles available for rent.",
        url: "/rent-marketplace",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      {
        name: "My Rentals",
        short_name: "Rentals",
        description: "Review your rent requests.",
        url: "/my-rentals",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
