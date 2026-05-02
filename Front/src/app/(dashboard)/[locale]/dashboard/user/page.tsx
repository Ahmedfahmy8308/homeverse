// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { generalApi } from "@/lib/api";
import {
  HiOutlineEye,
  HiOutlineTrendingUp,
  HiOutlineHeart,
} from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";

export default function UserDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await generalApi.getWishlist();
        if (!active) return;
        setFavoriteCount((res.data || []).length);
      } catch (error) {
        console.warn("Failed to load dashboard favorites", error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      icon: HiOutlineBuildingOffice,
      label: t("dashboard_my_properties"),
      value: "12",
      color: "from-blue-500/20 to-blue-600/20",
      textColor: "text-blue-400",
    },
    {
      icon: HiOutlineHeart,
      label: t("dashboard_favorites"),
      value: String(favoriteCount),
      color: "from-red-500/20 to-red-600/20",
      textColor: "text-red-400",
    },
    {
      icon: HiOutlineEye,
      label: t("dashboard_profile_views"),
      value: "340",
      color: "from-green-500/20 to-green-600/20",
      textColor: "text-green-400",
    },
    {
      icon: HiOutlineTrendingUp,
      label: t("dashboard_active_listings"),
      value: "8",
      color: "from-orange-500/20 to-orange-600/20",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="card p-10 bg-linear-to-r from-orange-500/10 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-3">
          {t("dashboard_welcome")}, {user?.first_name}!
        </h2>
        <p className="text-white/40">{t("dashboard_summary")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="card p-7 animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`w-14 h-14 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-5`}
            >
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/40 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-8">
        <h3 className="text-lg font-semibold text-white mb-6">
          {t("dashboard_recent_activity")}
        </h3>
        <div className="space-y-5">
          {[
            { action: t("dashboard_activity_1"), time: t("dashboard_time_1") },
            { action: t("dashboard_activity_2"), time: t("dashboard_time_2") },
            { action: t("dashboard_activity_3"), time: t("dashboard_time_3") },
            { action: t("dashboard_activity_4"), time: t("dashboard_time_4") },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
            >
              <p className="text-sm text-white/60">{item.action}</p>
              <span className="text-xs text-white/30 whitespace-nowrap ml-4">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
