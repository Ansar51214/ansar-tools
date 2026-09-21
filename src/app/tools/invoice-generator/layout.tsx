import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Pro Invoice & GST Bill Studio — Ansar Tools",
  description: "Create, customize, and print professional invoices with automatic tax, discount, currency conversion, and number-to-words calculation.",
};

const toolSchema = generateToolSchema({
  name: "Pro Invoice & GST Bill Studio",
  description: "Create, customize, and print professional invoices with automatic tax, discount, currency conversion, and number-to-words calculation.",
  url: "https://ansartools.com/tools/invoice-generator",
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
