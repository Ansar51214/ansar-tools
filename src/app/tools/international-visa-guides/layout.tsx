import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "International Visa Guides — Ansar Tools",
  description: "Authentic visa application directory for Pakistani passport holders covering Dubai, Saudi Arabia, UK, Schengen, USA, and Far East.",
};

const toolSchema = generateToolSchema({
  name: "International Visa Guides",
  description: "Authentic visa application directory for Pakistani passport holders covering Dubai, Saudi Arabia, UK, Schengen, USA, and Far East.",
  url: "https://ansartools.com/tools/international-visa-guides",
  category: "UtilitiesApplication",
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      {children}
    </>
  );
}
