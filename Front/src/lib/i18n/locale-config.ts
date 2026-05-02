// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_CONFIG = {
  en: {
    label: "English",
    direction: "ltr" as const,
    flag: "🇺🇸",
  },
  ar: {
    label: "العربية",
    direction: "rtl" as const,
    flag: "🇸🇦",
  },
} as const;

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): {
  locale: Locale;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return {
      locale: firstSegment,
      pathnameWithoutLocale: "/" + segments.slice(1).join("/"),
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    pathnameWithoutLocale: pathname,
  };
}

export function detectLocaleFromHeaders(request: Request): Locale {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q = "1"] = lang.trim().split(";q=");
      return { code: code.toLowerCase(), priority: parseFloat(q) };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const lang of languages) {
    if (lang.code.startsWith("ar")) return "ar";
    if (lang.code.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}
