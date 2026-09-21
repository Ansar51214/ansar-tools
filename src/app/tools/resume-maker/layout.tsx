import type { Metadata } from "next";
import { generateToolSchema } from "@/lib/toolSchema";

export const metadata: Metadata = {
  title: "Pro ATS Resume Maker — Ansar Tools",
  description: "Design ATS-compliant professional resumes with real-time formatting, recruiter-approved sections, custom themes, and clean PDF export.",
};

const toolSchema = generateToolSchema({
  name: "Pro ATS Resume Maker",
  description: "Design ATS-compliant professional resumes with real-time formatting, recruiter-approved sections, custom themes, and clean PDF export.",
  url: "https://ansartools.com/tools/resume-maker",
  category: "BusinessApplication",
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
