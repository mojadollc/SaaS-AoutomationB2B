import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = "https://aurex.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Aurex – AI Automation Platform for Business | Automate Support, Bookings & Leads",
    template: "%s | Aurex",
  },
  description: "Aurex is an AI automation platform that deploys intelligent agents to handle customer support, appointment bookings, lead follow-ups, and reports — 24/7, across every channel. Trusted by 10,000+ businesses in Southeast Asia.",
  keywords: [
    "AI automation platform", "AI agents for business", "customer support automation",
    "appointment booking AI", "lead follow-up automation", "business automation software",
    "AI chatbot Philippines", "automated customer service", "AI SaaS Philippines",
    "small business automation", "AI for restaurants", "AI for clinics",
  ],
  authors: [{ name: "Aurex", url: BASE_URL }],
  creator: "Aurex Technologies Inc.",
  publisher: "Aurex Technologies Inc.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: BASE_URL,
    siteName: "Aurex",
    title: "Aurex – AI Automation Platform for Business",
    description: "Deploy AI agents that handle customer support, bookings, leads, and reports — 24/7, without extra staff.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Aurex AI Automation Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurex – AI Automation Platform for Business",
    description: "Deploy AI agents that handle customer support, bookings, leads, and reports — 24/7, without extra staff.",
    images: ["/og-image.png"],
    creator: "@aurexio",
  },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
