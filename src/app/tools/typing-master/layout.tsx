import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Urdu, Hindi & English Typing Master — Ansar Tools",
  description: "Improve typing speed with interactive touch typing exercises in Urdu (Phonetic), Hindi, and English. Test WPM and download certificates.",
};

const toolSchema = generateToolSchema({
  name: "Urdu, Hindi & English Typing Master",
  description: "Improve typing speed with interactive touch typing exercises in Urdu (Phonetic), Hindi, and English. Test WPM and download certificates.",
  url: "https://ansartools.com/tools/typing-master",
  category: "EducationalApplication",
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
