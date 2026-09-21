import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Content Calendar & Campaign Planner — Ansar Tools",
  description: "Streamline your multi-platform content scheduling with our interactive spreadsheet and calendar workspace.",
};

const toolSchema = generateToolSchema({
  name: "Content Calendar & Campaign Planner",
  description: "Streamline your multi-platform content scheduling with our interactive spreadsheet and calendar workspace.",
  url: "https://ansartools.com/tools/content-calendar",
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
