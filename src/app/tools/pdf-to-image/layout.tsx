import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image Converter — Convert PDF Pages to High-Res JPG & PNG",
  description: "Extract every page of your PDF into high-quality JPG or PNG images instantly in your browser with zero upload lag.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
