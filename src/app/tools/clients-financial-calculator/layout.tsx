import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Clients & Financial Freedom Calculator — Ansar Tools",
  description: "Calculate your exact monthly survival budget, income gap, required client pipeline, and daily outreach targets.",
};

const toolSchema = generateToolSchema({
  name: "Clients & Financial Freedom Calculator",
  description: "Calculate your exact monthly survival budget, income gap, required client pipeline, and daily outreach targets.",
  url: "https://ansartools.com/tools/clients-financial-calculator",
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
