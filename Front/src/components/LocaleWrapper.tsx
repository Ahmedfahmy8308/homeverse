// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isValidLocale, LOCALE_CONFIG } from "@/lib/i18n/locale-config";

export default function LocaleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (isValidLocale(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale).catch(console.error);
      if (typeof document !== "undefined") {
        document.documentElement.lang = locale;
        document.documentElement.dir =
          LOCALE_CONFIG[locale as keyof typeof LOCALE_CONFIG].direction;
      }
    }
  }, [locale, i18n]);

  return <>{children}</>;
}
