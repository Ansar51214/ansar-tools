import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Cards Maker — Custom Digital Invitations & Shadi Cards",
  description: "Design traditional and modern wedding invitation cards, Barat & Walima announcements with Urdu/English typography and gold borders.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
