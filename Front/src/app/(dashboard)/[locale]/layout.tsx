// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { SUPPORTED_LOCALES, isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { AppProviders } from "@/components/AppProviders";

/**
 * generateStaticParams ensures that /[locale] routes are pre-rendered at build time.
 * This is crucial for avoiding 404s on Vercel production.
 */
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface DashboardLocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLocaleLayout({
  children,
  params,
}: DashboardLocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";

  return (
    <AppProviders locale={locale}>
      {children}
    </AppProviders>
  );
}
