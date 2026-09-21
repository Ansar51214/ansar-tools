import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "FBR Tax Services — Ansar Tools",
  description: "Comprehensive portal for Pakistani taxpayers: FBR Active Taxpayer List (ATL) status, NTN verification, and income tax filing guidelines.",
};

const toolSchema = generateToolSchema({
  name: "FBR Tax Services",
  description: "Comprehensive portal for Pakistani taxpayers: FBR Active Taxpayer List (ATL) status, NTN verification, and income tax filing guidelines.",
  url: "https://ansartools.com/tools/fbr-tax-services",
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
