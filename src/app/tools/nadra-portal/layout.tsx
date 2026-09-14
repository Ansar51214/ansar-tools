import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NADRA Identity Portal — Smart CNIC, FRC, CRC & Pak-ID Guide",
  description: "Official guidelines and direct links for NADRA Smart Card renewals, Family Registration Certificates (FRC), and civil registration in Pakistan.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
