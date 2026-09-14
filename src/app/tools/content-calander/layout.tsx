import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Content Calendar — Plan, Schedule & Organize Posts",
  description: "Plan and organize your monthly content marketing schedule, social media posts, campaigns, and content pipeline.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
