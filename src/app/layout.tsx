import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ansartools.com/#organization",
      "name": "Ansar Tools",
      "url": "https://ansartools.com",
      "logo": "https://ansartools.com/logo.svg",
      "description": "Pakistan's all-in-one free digital utility suite offering PDF, document, image, and productivity tools.",
    },
    {
      "@type": "WebSite",
      "@id": "https://ansartools.com/#website",
      "name": "Ansar Tools",
      "url": "https://ansartools.com",
      "publisher": {
        "@id": "https://ansartools.com/#organization",
      },
      "description": "Pakistan's all-in-one free digital utility suite offering PDF, document, image, and productivity tools.",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {/* To enable analytics, create a GA4 property at analytics.google.com, get the Measurement ID (starts with G-), and set NEXT_PUBLIC_GA_MEASUREMENT_ID in your deployment environment's env vars (e.g. Vercel project settings). */}
        {gaMeasurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
