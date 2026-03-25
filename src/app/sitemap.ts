import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.alfombra2.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          es: `${SITE_URL}/es`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${SITE_URL}/es/products`,
          en: `${SITE_URL}/en/products`,
        },
      },
    },
    {
      url: `${SITE_URL}/designer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}/es/designer`,
          en: `${SITE_URL}/en/designer`,
        },
      },
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${SITE_URL}/es/courses`,
          en: `${SITE_URL}/en/courses`,
        },
      },
    },
  ];
}
