// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/context/AuthContext";
import i18n from "@/lib/i18n";

export function AppProviders({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  useEffect(() => {
    // Sync language if it differs from current
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale).catch(console.error);
    }
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>{children}</AuthProvider>
    </I18nextProvider>
  );
}
