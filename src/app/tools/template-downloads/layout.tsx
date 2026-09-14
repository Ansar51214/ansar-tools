import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Downloads — Free PSD, Word & Graphic Design Assets",
  description: "Download free graphic templates, business card layouts, invoice designs, certificates, and ID card source files.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
