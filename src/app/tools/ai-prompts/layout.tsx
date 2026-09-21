import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "AI Prompts Vault — Ansar Tools",
  description: "Browse and customize high-converting AI prompts for graphic design, coding, writing, marketing, career, and business productivity.",
};

const toolSchema = generateToolSchema({
  name: "AI Prompts Vault",
  description: "Browse and customize high-converting AI prompts for graphic design, coding, writing, marketing, career, and business productivity.",
  url: "https://ansartools.com/tools/ai-prompts",
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
