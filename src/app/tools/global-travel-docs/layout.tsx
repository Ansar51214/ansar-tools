import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Travel Docs Prep — Visa Cover Letter, MOFA Attestation & SBP Rules",
  description: "Prepare embassy-grade cover letters, calculate minimum bank balance benchmarks, and verify MOFA Apostille and NIMS polio certificates.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
