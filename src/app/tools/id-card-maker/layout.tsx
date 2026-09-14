import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro ID Card Maker — Design & Print Employee, Student & Press Badges",
  description: "Create professional ID cards, student badges, and corporate credentials with custom photos, barcodes, QR codes, and print layouts.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
