// app/layout.tsx

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zielabs | Digital Product Agency",
    template: "Zielabs | %s",
  },
  description:
    "Zielabs adalah agensi produk digital premium yang membangun Web App, Mobile App, POS, SaaS, dan Desktop App berkelas enterprise. Engineering digital excellence.",
  keywords: [
    "Zielabs",
    "digital agency",
    "web development",
    "mobile app",
    "SaaS",
    "enterprise system",
    "POS",
    "Next.js",
    "Indonesia",
  ],
  authors: [{ name: "Zielabs", url: "https://zielabs.com" }],
  creator: "Zielabs",
  metadataBase: new URL("https://zielabs.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://zielabs.com",
    siteName: "Zielabs",
    title: "Zielabs | Digital Product Agency",
    description:
      "Premium digital product agency building enterprise-grade Web Apps, Mobile Apps, POS, SaaS & Desktop solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zielabs | Digital Product Agency",
    description:
      "Premium digital product agency building enterprise-grade solutions.",
    creator: "@zielabs",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-100">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
