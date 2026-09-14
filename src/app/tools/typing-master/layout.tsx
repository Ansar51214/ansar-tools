import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Master — Urdu, Hindi & English Speed Typing Test & Certificate",
  description: "Improve typing speed with interactive touch typing exercises in Urdu (Phonetic), Hindi, and English. Test WPM and download certificates.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
