// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./domains/en";
import translationAR from "./domains/ar";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
};

const getInitialLng = () => {
  if (typeof window !== "undefined") {
    const segments = window.location.pathname.split("/");
    if (segments[1] === "ar") return "ar";
    if (segments[1] === "en") return "en";
  }
  return "en";
};

import type { InitOptions } from "i18next";

// Cast to `InitOptions` to satisfy TypeScript when i18next/react-i18next
// type definitions differ from runtime options used here.
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: getInitialLng(),
  debug: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  detection: { order: [] },
  initImmediate: false,
  load: "languageOnly",
  preload: ["en", "ar"],
  saveMissing: false,
  compatibilityJSON: "v4",
  cleanCode: true,
  returnNull: false,
  returnEmptyString: false,
} as unknown as InitOptions);

export default i18n;
