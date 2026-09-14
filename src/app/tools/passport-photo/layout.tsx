import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passport Photo Converter — Generate 2x2 & 35x45mm Printable Sheets",
  description: "Convert personal portraits into compliant passport and visa photos with white/blue backgrounds and multi-photo print sheets.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
