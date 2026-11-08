import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rewindverse.dev";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs", "/examples", "/learn", "/product", "/roadmap", "/share/"],
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

