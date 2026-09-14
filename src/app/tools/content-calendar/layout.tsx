import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Calendar & Campaign Planner — Google Drive Sync",
  description: "Streamline your multi-platform content scheduling with our interactive spreadsheet and calendar workspace.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
