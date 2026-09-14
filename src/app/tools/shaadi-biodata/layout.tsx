import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shaadi Biodata Maker — Elegant Islamic & Desi Marriage Profiles",
  description: "Create beautiful marriage biodatas with religious details, family background, partner preferences, and premium printable layouts.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
