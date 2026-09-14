import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compressor — Reduce PDF File Size Online Free",
  description: "Shrink large PDF documents to under 1MB, 500KB, or 200KB for government job portals, university submissions, and email attachments.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
