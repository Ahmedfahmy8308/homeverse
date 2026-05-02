// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

const VERCEL_API = "https://api.homeverse.ufuq-tech.com";

export const NEXT_PUBLIC_API_URL = (() => {
  // 1) explicit env override (build time)
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // 2) client-side runtime detection (works in browser builds on Vercel or custom domain)
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    if (
      host.includes("homeverse.ufuq-tech.com") ||
      host.includes("vercel.app")
    ) {
      return VERCEL_API;
    }
    return "/api";
  }

  // 3) build/server-side fallback (when window is not available)
  if (process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL) return VERCEL_API;
  return "/api";
})();

export const APP_NAME = "Homeverse";
export const APP_DESCRIPTION = "Find Your Dream Home - Real Estate Marketplace";
