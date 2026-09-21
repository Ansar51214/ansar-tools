import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "PDF to Image Converter — Ansar Tools",
  description: "Extract every page of your PDF into high-quality JPG or PNG images instantly in your browser with zero upload lag.",
};

const toolSchema = generateToolSchema({
  name: "PDF to Image Converter",
  description: "Extract every page of your PDF into high-quality JPG or PNG images instantly in your browser with zero upload lag.",
  url: "https://ansartools.com/tools/pdf-to-image",
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
