import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Merge PDF — Ansar Tools",
  description: "Easily merge multiple PDF documents into a single organized file with drag-and-drop reordering, page preview, and high-speed processing.",
};

const toolSchema = generateToolSchema({
  name: "Merge PDF",
  description: "Easily merge multiple PDF documents into a single organized file with drag-and-drop reordering, page preview, and high-speed processing.",
  url: "https://ansartools.com/tools/merge-pdf",
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
