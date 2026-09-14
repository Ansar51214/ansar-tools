import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator — Create Custom QR Codes for URLs, WiFi & WhatsApp",
  description: "Generate high-resolution vector QR codes for websites, contact cards, Wi-Fi networks, WhatsApp chat, and text with custom colors.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
