import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Pro ID Card Maker & PSD Studio — Ansar Tools",
  description: "Create professional ID cards, student badges, and corporate credentials with custom photos, barcodes, QR codes, and print layouts.",
};

const toolSchema = generateToolSchema({
  name: "Pro ID Card Maker & PSD Studio",
  description: "Create professional ID cards, student badges, and corporate credentials with custom photos, barcodes, QR codes, and print layouts.",
  url: "https://ansartools.com/tools/id-card-maker",
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
