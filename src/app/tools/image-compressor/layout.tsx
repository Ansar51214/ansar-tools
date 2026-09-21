import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Image Compressor — Ansar Tools",
  description: "Reduce image file sizes by up to 90% while preserving visual clarity. Perfect for web optimization, portals, and online forms.",
};

const toolSchema = generateToolSchema({
  name: "Image Compressor",
  description: "Reduce image file sizes by up to 90% while preserving visual clarity. Perfect for web optimization, portals, and online forms.",
  url: "https://ansartools.com/tools/image-compressor",
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
