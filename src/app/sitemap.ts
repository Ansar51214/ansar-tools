import type { MetadataRoute } from "next";

const CANONICAL_TOOLS = [
  "age-calculator",
  "ai-prompts",
  "background-remover",
  "clients-financial-calculator",
  "content-calendar",
  "ecommerce-calculator",
  "fbr-tax-services",
  "global-travel-docs",
  "id-card-maker",
  "image-compressor",
  "international-visa-guides",
  "invoice-generator",
  "merge-pdf",
  "meta-glasses",
  "nadra-portal",
  "online-pdf-editor",
  "pakistan-jobs",
  "passport-photo-maker",
  "pdf-compressor",
  "pdf-to-image",
  "png-to-jpg",
  "qr-generator",
  "resume-maker",
  "shaadi-biodata",
  "template-downloads",
  "typing-master",
  "wedding-cards",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ansartools.com").replace(/\/+$/, "");
  const currentDate = new Date();

  const toolEntries: MetadataRoute.Sitemap = CANONICAL_TOOLS.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...toolEntries,
  ];
}
