import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients Financial Calculator — Monthly Income & Client Target Blueprint",
  description: "Calculate your exact monthly survival budget, income gap, required client pipeline, and daily outreach targets.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
