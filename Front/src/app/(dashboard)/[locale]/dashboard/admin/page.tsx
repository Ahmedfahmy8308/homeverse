// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RoleGuard } from "@/guards";
import { generalApi, propertiesApi } from "@/lib/api";
import type { AdminDashboardStats } from "@/lib/types";
import type { Property } from "@/lib/types";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import {
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineTrendingUp,
  HiOutlineEye,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
} from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { getLocalizedValue } from "@/lib/i18n/localized";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  const normalizedStats: AdminDashboardStats | null = stats
    ? {
        users: stats.users ?? stats.totalUsers ?? 0,
        properties: stats.properties ?? stats.totalProperties ?? 0,
        blog_posts: stats.blog_posts ?? stats.totalPosts ?? 0,
        agents: stats.agents ?? stats.totalAgents ?? 0,
        featured_properties: stats.featured_properties ?? stats.totalFeatured ?? 0,
        unread_messages: stats.unread_messages ?? 0,
        reviews: stats.reviews ?? 0,
        subscribers: stats.subscribers ?? 0,
        pageViews: stats.pageViews ?? 0,
        monthlyRevenue: stats.monthlyRevenue ?? 0,
        newRegistrations: stats.newRegistrations ?? 0,
        newListings: stats.newListings ?? 0,
        revenueChart: stats.revenueChart ?? [],
      }
    : null;

  const getPropertyTitle = (property: Property) =>
    getLocalizedValue(property.title, locale);
  const getPropertyLocation = (property: Property) =>
    getLocalizedValue(property.location, locale);
  useEffect(() => {
    if (isLoading || user?.role !== "admin") {
      return;
    }

    let active = true;
    (async () => {
      try {
        const [sRes, propsRes] = await Promise.all([
          generalApi.getAdminDashboard(),
          propertiesApi.listProperties(),
        ]);
        if (!active) return;
        setStats(sRes.data as AdminDashboardStats);
        setRecentProperties(((propsRes.data as Property[]) || []).slice(0, 5));
      } catch (e) {
        console.warn("Failed loading admin dashboard data", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [isLoading, user?.role]);

  const statTiles = normalizedStats
    ? [
        {
          icon: HiOutlineUserGroup,
          label: t("admin_total_users"),
          value: normalizedStats.users.toLocaleString(),
          change: "+12%",
          color: "text-blue-400",
          bg: "from-blue-500/20 to-blue-600/20",
        },
        {
          icon: HiOutlineBuildingOffice,
          label: t("admin_total_properties"),
          value: normalizedStats.properties.toLocaleString(),
          change: "+8%",
          color: "text-green-400",
          bg: "from-green-500/20 to-green-600/20",
        },
        {
          icon: HiOutlineDocumentText,
          label: t("admin_total_posts"),
          value: normalizedStats.blog_posts.toLocaleString(),
          change: "+5%",
          color: "text-purple-400",
          bg: "from-purple-500/20 to-purple-600/20",
        },
        {
          icon: HiOutlineStar,
          label: t("admin_total_featured"),
          value: normalizedStats.featured_properties.toLocaleString(),
          change: "+15%",
          color: "text-orange-400",
          bg: "from-orange-500/20 to-orange-600/20",
        },
      ]
    : [];
  const revenueChart = normalizedStats?.revenueChart ?? [];

  return (
    <RoleGuard roles="admin">
      <div className="space-y-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white">{t("admin_title")}</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statTiles.map((stat, idx) => (
            <div
              key={idx}
              className="card p-6"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-lg bg-linear-to-br ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                  <HiOutlineTrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-7">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-white mb-5">
              Revenue Overview
            </h3>
            <div className="flex items-end gap-2 h-44">
              {revenueChart.map((h: number, i: number) => (
                <div
                  key={i}
                  className="flex-1 bg-linear-to-t from-orange-500/40 to-orange-500/10 rounded-t transition-all hover:from-orange-500/60"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/30">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-base font-semibold text-white mb-5">
              Quick Stats
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: HiOutlineEye,
                  label: "Page Views Today",
                  value: normalizedStats?.pageViews?.toLocaleString() ?? "-",
                  color: "text-blue-400",
                },
                {
                  icon: HiOutlineCurrencyDollar,
                  label: "Revenue This Month",
                  value:
                    normalizedStats?.monthlyRevenue != null
                      ? `EGP ${normalizedStats.monthlyRevenue.toLocaleString()}`
                      : "-",
                  color: "text-green-400",
                },
                {
                  icon: HiOutlineUserGroup,
                  label: "New Registrations",
                  value: normalizedStats?.newRegistrations?.toString() ?? "-",
                  color: "text-purple-400",
                },
                {
                  icon: HiOutlineBuildingOffice,
                  label: "New Listings",
                  value: normalizedStats?.newListings?.toString() ?? "-",
                  color: "text-orange-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/3 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-white/60">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-base font-semibold text-white">
              Recent Properties
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Image",
                    "Title",
                    "Location",
                    "Price",
                    "Type",
                    "Rating",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-medium text-white/40 uppercase tracking-wider px-6 py-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-9 rounded overflow-hidden">
                        <Image
                          src={p.images[0]}
                          alt={getPropertyTitle(p)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {getPropertyTitle(p)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {getPropertyLocation(p)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {p.currency} {p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${p.type === "rent" ? "badge-green" : "badge-orange"}`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {p.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
