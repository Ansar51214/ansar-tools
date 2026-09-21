import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "QR Code Generator — Ansar Tools",
  description: "Generate high-resolution vector QR codes for websites, contact cards, Wi-Fi networks, WhatsApp chat, and text with custom colors.",
};

const toolSchema = generateToolSchema({
  name: "QR Code Generator",
  description: "Generate high-resolution vector QR codes for websites, contact cards, Wi-Fi networks, WhatsApp chat, and text with custom colors.",
  url: "https://ansartools.com/tools/qr-generator",
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
