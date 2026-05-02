// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import type { Locale } from "./locale-config";

export type LocalizedValue<T> = {
  en: T;
  ar: T;
};

export function getLocalizedValue<T>(
  value: LocalizedValue<T>,
  locale: Locale,
): T {
  return value[locale] ?? value.en;
}
