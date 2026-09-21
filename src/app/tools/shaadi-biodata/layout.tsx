import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Shaadi Biodata Maker — Ansar Tools",
  description: "Create beautiful marriage biodatas with religious details, family background, partner preferences, and premium printable layouts.",
};

const toolSchema = generateToolSchema({
  name: "Shaadi Biodata Maker",
  description: "Create beautiful marriage biodatas with religious details, family background, partner preferences, and premium printable layouts.",
  url: "https://ansartools.com/tools/shaadi-biodata",
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
