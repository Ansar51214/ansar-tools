import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passport Photo Maker Studio — AI Suit Changer, Crop & 4x6 Print Grid",
  description: "Create biometric passport photos with AI suit overlays, custom background colors, face centering, and print-ready grid sheets.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
