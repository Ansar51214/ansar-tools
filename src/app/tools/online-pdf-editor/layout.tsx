import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Online PDF Editor — Ansar Tools",
  description: "Full-featured browser PDF editor. Add text with Google Fonts, draw digital signatures, annotate shapes, highlight, and erase content seamlessly.",
};

const toolSchema = generateToolSchema({
  name: "Online PDF Editor",
  description: "Full-featured browser PDF editor. Add text with Google Fonts, draw digital signatures, annotate shapes, highlight, and erase content seamlessly.",
  url: "https://ansartools.com/tools/online-pdf-editor",
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
