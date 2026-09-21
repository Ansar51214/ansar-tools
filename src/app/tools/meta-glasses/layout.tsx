import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Meta Glasses 3D Effect — Ansar Tools",
  description: "Convert and inject EXIF camera metadata into photos to simulate Meta smart glasses and camera hardware tags.",
};

const toolSchema = generateToolSchema({
  name: "Meta Glasses 3D Effect",
  description: "Convert and inject EXIF camera metadata into photos to simulate Meta smart glasses and camera hardware tags.",
  url: "https://ansartools.com/tools/meta-glasses",
  category: "MultimediaApplication",
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
