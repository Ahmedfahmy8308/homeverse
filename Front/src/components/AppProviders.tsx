// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { ReactNode, useLayoutEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import { isValidLocale, LOCALE_CONFIG } from "@/lib/i18n/locale-config";

export function AppProviders({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  useLayoutEffect(() => {
    if (!isValidLocale(locale)) {
      return;
    }

    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = LOCALE_CONFIG[locale].direction;
    }
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n} key={locale}>
      <AuthProvider>{children}</AuthProvider>
    </I18nextProvider>
  );
}
