import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rewindverse.dev";
  const routes = [
    "",
    "/docs",
    "/examples",
    "/learn",
    "/product",
    "/how-it-works",
    "/visualizations",
    "/security",
    "/about",
    "/roadmap",
    "/settings",
    "/studio",
    "/studio/algorithms",
    "/studio/forge",
    "/studio/lab",
    "/studio/import",
    "/studio/compare",
    "/studio/insights",
    "/studio/academy",
    "/studio/embeddings",
    "/studio/settings",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route.startsWith("/studio") ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/studio") ? 0.9 : 0.7,
  }));
}

