import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Glasses Photo Converter — Add GPS & EXIF Metadata Online",
  description: "Convert and inject EXIF camera metadata into photos to simulate Meta smart glasses and camera hardware tags.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
