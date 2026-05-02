// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "@/guards";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  type DashboardLink = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };

  const userLinks: DashboardLink[] = [
    {
      href: `/${locale}/dashboard/user`,
      label: t("dashboard_overview"),
      icon: HiOutlineChartBar,
    },
    {
      href: `/${locale}/dashboard/user/profile`,
      label: t("dashboard_profile"),
      icon: HiOutlineUser,
    },
    {
      href: `/${locale}/dashboard/user/favorites`,
      label: t("dashboard_favorites"),
      icon: HiOutlineHeart,
    },
    {
      href: `/${locale}/dashboard/user/my-properties`,
      label: t("dashboard_my_properties"),
      icon: HiOutlineBuildingOffice,
    },
  ];

  const adminLinks: DashboardLink[] = [
    {
      href: `/${locale}/dashboard/admin`,
      label: t("admin_title"),
      icon: HiOutlineChartBar,
    },
    {
      href: `/${locale}/dashboard/admin/properties`,
      label: t("admin_properties"),
      icon: HiOutlineBuildingOffice,
    },
    {
      href: `/${locale}/dashboard/admin/users`,
      label: t("admin_users"),
      icon: HiOutlineUserGroup,
    },
    {
      href: `/${locale}/dashboard/admin/blog`,
      label: t("admin_blog"),
      icon: HiOutlineDocumentText,
    },
    {
      href: `/${locale}/dashboard/admin/settings`,
      label: t("dashboard_settings"),
      icon: HiOutlineCog,
    },
  ];

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        pathname === href
          ? "bg-orange-500/10 text-orange-400 font-medium"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 flex">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <HiOutlineHome className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Home<span className="text-orange-500">verse</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>

          {/* User Card */}
          <div className="px-5 py-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center text-sm font-bold text-orange-400 shrink-0">
                {user?.first_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[11px] text-white/40">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
              {isAdmin ? "Administration" : "Main"}
            </p>
            <div className="space-y-0.5">
              {(isAdmin ? adminLinks : userLinks).map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="px-3 py-3 border-t border-white/5 shrink-0">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <HiOutlineLogout className="w-4.5 h-4.5" />
              <span>{t("nav_logout")}</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-white">
              {t("dashboard_title")}
            </h1>
            <Link
              href={`/${locale}`}
              className="ml-auto text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <HiOutlineHome className="w-3.5 h-3.5" />
              Back to Site
            </Link>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
