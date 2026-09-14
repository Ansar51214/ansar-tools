import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Commerce Profit & Growth Calculator — Unit Economics & Scaling",
  description: "Analyze store profitability, CAC, advertising spend, cost of goods sold, and monthly growth projections.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
