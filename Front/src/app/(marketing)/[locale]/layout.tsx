// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import LocaleWrapper from "@/components/LocaleWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * generateStaticParams ensures that /[locale] routes are pre-rendered at build time.
 * This is crucial for avoiding 404s on Vercel production.
 */
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleWrapper>
      <Header />
      <main>{children}</main>
      <Footer />
    </LocaleWrapper>
  );
}
