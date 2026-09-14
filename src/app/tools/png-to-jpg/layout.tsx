import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNG to JPG Converter — Convert Transparent PNGs to Optimized JPGs",
  description: "Fast and secure batch image format converter. Convert PNG files to high-definition JPGs with custom background color fill.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
