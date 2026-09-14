import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Revenue Calculator — Freelance Pricing & Client Goals",
  description: "Calculate your monthly client target, retainer package pricing, and business revenue gap with live financial metrics.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
