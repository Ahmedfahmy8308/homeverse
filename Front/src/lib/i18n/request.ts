// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { getRequestConfig } from "next-intl/server";
import en from "./domains/en";
import ar from "./domains/ar";

export default getRequestConfig(({ locale }) => ({
  messages: locale === "en" ? en : ar,
  locale: locale ?? "en",
}));
