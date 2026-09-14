import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompts Vault — 150+ Curated Prompts for ChatGPT, Claude & Gemini",
  description: "Browse and customize high-converting AI prompts for graphic design, coding, writing, marketing, career, and business productivity.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
