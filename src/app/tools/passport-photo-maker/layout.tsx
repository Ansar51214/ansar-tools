import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Passport Size Photo Maker — Ansar Tools",
  description: "Create biometric passport photos with AI suit overlays, custom background colors, face centering, and print-ready grid sheets.",
};

const toolSchema = generateToolSchema({
  name: "Passport Size Photo Maker",
  description: "Create biometric passport photos with AI suit overlays, custom background colors, face centering, and print-ready grid sheets.",
  url: "https://ansartools.com/tools/passport-photo-maker",
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
