import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Age Calculator — Ansar Tools",
  description: "Free online age calculator. Calculate your exact age in years, months, weeks, days, hours, and find out your upcoming milestone birthdays.",
};

const toolSchema = generateToolSchema({
  name: "Age Calculator",
  description: "Free online age calculator. Calculate your exact age in years, months, weeks, days, hours, and find out your upcoming milestone birthdays.",
  url: "https://ansartools.com/tools/age-calculator",
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
