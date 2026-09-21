import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "PDF Compressor — Ansar Tools",
  description: "Shrink large PDF documents to under 1MB, 500KB, or 200KB for government job portals, university submissions, and email attachments.",
};

const toolSchema = generateToolSchema({
  name: "PDF Compressor",
  description: "Shrink large PDF documents to under 1MB, 500KB, or 200KB for government job portals, university submissions, and email attachments.",
  url: "https://ansartools.com/tools/pdf-compressor",
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
