import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "PNG to JPG Converter — Ansar Tools",
  description: "Fast and secure batch image format converter. Convert PNG files to high-definition JPGs with custom background color fill.",
};

const toolSchema = generateToolSchema({
  name: "PNG to JPG Converter",
  description: "Fast and secure batch image format converter. Convert PNG files to high-definition JPGs with custom background color fill.",
  url: "https://ansartools.com/tools/png-to-jpg",
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
