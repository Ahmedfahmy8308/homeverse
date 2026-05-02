// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";

  useEffect(() => {
    if (isLoading || !user) return;
    const target =
      user.role === "admin"
        ? `/${locale}/dashboard/admin`
        : `/${locale}/dashboard/user`;
    router.replace(target);
  }, [isLoading, user, locale, router]);

  return <div className="card p-8 text-white/60">Loading...</div>;
}
