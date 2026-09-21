import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "AI Background Remover — Ansar Tools",
  description: "Instantly remove image backgrounds online for free with AI. Download clean transparent PNGs for ID cards, e-commerce, and design projects.",
};

const toolSchema = generateToolSchema({
  name: "AI Background Remover",
  description: "Instantly remove image backgrounds online for free with AI. Download clean transparent PNGs for ID cards, e-commerce, and design projects.",
  url: "https://ansartools.com/tools/background-remover",
  category: "MultimediaApplication",
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
