import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "E-Commerce Profit & Growth Calculator — Ansar Tools",
  description: "Calculate product profit margins, marketing ROAS, fulfillment costs, and net revenue for Shopify, Daraz, and Amazon stores.",
};

const toolSchema = generateToolSchema({
  name: "E-Commerce Profit & Growth Calculator",
  description: "Calculate product profit margins, marketing ROAS, fulfillment costs, and net revenue for Shopify, Daraz, and Amazon stores.",
  url: "https://ansartools.com/tools/ecommerce-calculator",
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
