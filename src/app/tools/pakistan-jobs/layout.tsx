import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pakistan Jobs & Testing Portals — NTS, FPSC, PPSC, PTS & Results",
  description: "Find verified government and private jobs in Pakistan with direct links to FPSC, PPSC, NTS, OTS, and educational boards.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
