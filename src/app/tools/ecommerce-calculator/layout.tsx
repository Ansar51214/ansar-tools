import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Commerce Calculator — Profit Margin, ROAS & Break-Even Tool",
  description: "Calculate product profit margins, marketing ROAS, fulfillment costs, and net revenue for Shopify, Daraz, and Amazon stores.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
