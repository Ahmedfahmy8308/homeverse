// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import type { Metadata, Viewport } from "next";
import { Cairo, Nunito_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/locale-config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Homeverse - Find Your Dream Home",
    template: "%s | Homeverse",
  },
  description:
    "Leading real estate marketplace in Egypt. Buy, sell, or rent properties with Homeverse.",
  keywords: [
    "real estate",
    "properties",
    "Egypt",
    "buy home",
    "rent home",
    "sell home",
    "homeverse",
  ],
  authors: [{ name: "Homeverse Team" }],
  creator: "Homeverse",
  publisher: "Homeverse",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    siteName: "Homeverse",
    title: "Homeverse - Find Your Dream Home",
    description: "Leading real estate marketplace in Egypt",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  let locale: Locale = DEFAULT_LOCALE;
  let localeConfig: (typeof LOCALE_CONFIG)[Locale] =
    LOCALE_CONFIG[DEFAULT_LOCALE];

  if (params) {
    const resolvedParams = await params;
    if (resolvedParams?.locale && isValidLocale(resolvedParams.locale)) {
      locale = resolvedParams.locale as Locale;
      localeConfig = LOCALE_CONFIG[locale];
    }
  }

  return (
    <html
      lang={locale}
      dir={localeConfig.direction}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#e8651a" />
      </head>
      <body
        className={`${locale === "ar" ? cairo.className : `${poppins.className} ${nunito.className}`} ${
          locale === "ar" ? "font-arabic" : ""
        }`}
      >
        <AppProviders locale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
