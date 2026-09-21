import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Global Travel Docs Prep — Ansar Tools",
  description: "Prepare embassy-grade cover letters, calculate minimum bank balance benchmarks, and verify MOFA Apostille and NIMS polio certificates.",
};

const toolSchema = generateToolSchema({
  name: "Global Travel Docs Prep",
  description: "Prepare embassy-grade cover letters, calculate minimum bank balance benchmarks, and verify MOFA Apostille and NIMS polio certificates.",
  url: "https://ansartools.com/tools/global-travel-docs",
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
