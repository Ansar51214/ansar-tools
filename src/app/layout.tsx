import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../../public/fonts/geist-sans.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../../public/fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Ansar Tools — Free Online PDF, Design, Calculator & Identity Tools",
    template: "%s | Ansar Tools",
  },
  description: "Ansar Tools is a powerful all-in-one suite of free online tools: PDF editor, invoice generator, resume maker, ID card designer, typing master, and official portal guides.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
