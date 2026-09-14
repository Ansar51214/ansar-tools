import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online PDF Editor — Edit Text, Add Signature, Shapes & Erase Online",
  description: "Full-featured browser PDF editor. Add text with Google Fonts, draw digital signatures, annotate shapes, highlight, and erase content seamlessly.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
