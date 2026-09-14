import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ID Card Templates Studio — Free Downloadable Badges & Cards",
  description: "Browse and download customizable ID card templates for schools, colleges, companies, and organizations.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
