import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "NADRA Identity Portal — Ansar Tools",
  description: "Official guidelines and direct links for NADRA Smart Card renewals, Family Registration Certificates (FRC), and civil registration in Pakistan.",
};

const toolSchema = generateToolSchema({
  name: "NADRA Identity Portal",
  description: "Official guidelines and direct links for NADRA Smart Card renewals, Family Registration Certificates (FRC), and civil registration in Pakistan.",
  url: "https://ansartools.com/tools/nadra-portal",
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
