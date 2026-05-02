// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALE_CONFIG,
  getLocaleFromPathname,
  type Locale,
} from "@/lib/i18n/locale-config";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const { locale: currentLocale } = getLocaleFromPathname(pathname);
  const targetLocale: Locale = currentLocale === "en" ? "ar" : "en";
  const targetConfig = LOCALE_CONFIG[targetLocale];

  const switchLanguage = () => {
    const { pathnameWithoutLocale } = getLocaleFromPathname(pathname);
    const newPath = `/${targetLocale}${pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale}`;
    i18n.changeLanguage(targetLocale);
    document.documentElement.lang = targetLocale;
    document.documentElement.dir = targetConfig.direction;
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
      aria-label={`Switch to ${targetConfig.label}`}
    >
      <span>{targetConfig.flag}</span>
      <span>{targetConfig.label}</span>
    </button>
  );
}
