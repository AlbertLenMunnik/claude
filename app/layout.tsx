import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NexusCheck — Free Sales Tax Nexus Calculator for Ecommerce",
  description: "Find out where your online store owes sales tax in 30 seconds. Free nexus checker for Shopify, WooCommerce, and Amazon sellers. Based on the 2018 Wayfair ruling.",
  keywords: "sales tax nexus, nexus calculator, ecommerce sales tax, Wayfair nexus, do I need to collect sales tax",
  openGraph: {
    title: "NexusCheck — Do You Owe Sales Tax in Other States?",
    description: "Free tool for ecommerce sellers. Check your sales tax nexus exposure across all 50 states in 30 seconds.",
    type: "website",
    url: "https://nexuscheck.co",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusCheck — Free Sales Tax Nexus Calculator",
    description: "Check your sales tax nexus exposure across all 50 states in 30 seconds.",
  },
  alternates: { canonical: "https://nexuscheck.co" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0YT7BS795V"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-0YT7BS795V');gtag('config','AW-18021033999');`}
        </Script>
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
