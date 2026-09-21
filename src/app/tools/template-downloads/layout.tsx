import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Template Downloads — Ansar Tools",
  description: "Download free graphic templates, business card layouts, invoice designs, certificates, and ID card source files.",
};

const toolSchema = generateToolSchema({
  name: "Template Downloads",
  description: "Download free graphic templates, business card layouts, invoice designs, certificates, and ID card source files.",
  url: "https://ansartools.com/tools/template-downloads",
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
