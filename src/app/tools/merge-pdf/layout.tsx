import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files — Combine Multiple PDFs into One Document Free",
  description: "Easily merge multiple PDF documents into a single organized file with drag-and-drop reordering, page preview, and high-speed processing.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
