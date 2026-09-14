import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Background Remover — Free Transparent PNG Photo Cutout",
  description: "Instantly remove image backgrounds online for free with AI. Download clean transparent PNGs for ID cards, e-commerce, and design projects.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
