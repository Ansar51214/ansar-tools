import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator — Calculate Exact Age, Months, Days & Next Birthday",
  description: "Free online age calculator. Calculate your exact age in years, months, weeks, days, hours, and find out your upcoming milestone birthdays.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
