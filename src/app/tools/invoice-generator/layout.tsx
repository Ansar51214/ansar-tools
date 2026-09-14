import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Currency Invoice Generator — Free PDF Invoices (USD, PKR, EUR)",
  description: "Create, customize, and print professional invoices with automatic tax, discount, currency conversion, and number-to-words calculation.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
