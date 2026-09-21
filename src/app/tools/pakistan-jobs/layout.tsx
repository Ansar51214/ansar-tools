import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Latest Pakistan Jobs & Results Portal — Ansar Tools",
  description: "Find verified government and private jobs in Pakistan with direct links to FPSC, PPSC, NTS, OTS, and educational boards.",
};

const toolSchema = generateToolSchema({
  name: "Latest Pakistan Jobs & Results Portal",
  description: "Find verified government and private jobs in Pakistan with direct links to FPSC, PPSC, NTS, OTS, and educational boards.",
  url: "https://ansartools.com/tools/pakistan-jobs",
  category: "BusinessApplication",
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
