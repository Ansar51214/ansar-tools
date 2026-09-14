import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FBR Tax Services — NTN Verification, ATL Status & Tax Calculator",
  description: "Comprehensive portal for Pakistani taxpayers: FBR Active Taxpayer List (ATL) status, NTN verification, and income tax filing guidelines.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
