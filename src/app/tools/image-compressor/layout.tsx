import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — Compress JPG, PNG & WebP Without Quality Loss",
  description: "Reduce image file sizes by up to 90% while preserving visual clarity. Perfect for web optimization, portals, and online forms.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
