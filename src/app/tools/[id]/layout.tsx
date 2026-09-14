import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Directory — Ansar Tools Utility Hub",
  description: "Access free online browser utilities, design generators, and digital document converters on Ansar Tools.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
