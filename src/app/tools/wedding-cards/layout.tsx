import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Animated Wedding Cards — Ansar Tools",
  description: "Design traditional and modern wedding invitation cards, Barat & Walima announcements with Urdu/English typography and gold borders.",
};

const toolSchema = generateToolSchema({
  name: "Animated Wedding Cards",
  description: "Design traditional and modern wedding invitation cards, Barat & Walima announcements with Urdu/English typography and gold borders.",
  url: "https://ansartools.com/tools/wedding-cards",
  category: "DesignApplication",
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
