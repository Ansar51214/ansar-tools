import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro ATS Resume Maker — Build Job-Winning Resumes & Download PDF",
  description: "Design ATS-compliant professional resumes with real-time formatting, recruiter-approved sections, custom themes, and clean PDF export.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
