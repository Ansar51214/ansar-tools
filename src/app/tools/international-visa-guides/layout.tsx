import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Visa Guides — Official Embassy Portals & Requirements",
  description: "Authentic visa application directory for Pakistani passport holders covering Dubai, Saudi Arabia, UK, Schengen, USA, and Far East.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
