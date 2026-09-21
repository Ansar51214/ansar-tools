export interface ToolSchemaOptions {
  name: string;
  description: string;
  url: string;
  category?: string;
}

export function generateToolSchema({
  name,
  description,
  url,
  category = "UtilitiesApplication",
}: ToolSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: category,
    operatingSystem: "Any (Web-based)",
    url,
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
  };
}
