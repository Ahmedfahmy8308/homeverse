// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useTranslation } from "react-i18next";
import { HiOutlineHeart } from "react-icons/hi";

export default function FavoritesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">
        {t("dashboard_favorites")}
      </h2>
      <div className="card p-12 text-center">
        <HiOutlineHeart className="w-16 h-16 mx-auto text-white/10 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {t("dashboard_no_favorites_title")}
        </h3>
        <p className="text-white/40 text-sm">
          {t("dashboard_no_favorites_text")}
        </p>
      </div>
    </div>
  );
}
