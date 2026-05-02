// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getLocaleFromPathname } from "@/lib/i18n/locale-config";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineLogout,
} from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const { locale } = getLocaleFromPathname(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    let active = true;
    if (locale) {
      i18n
        .changeLanguage(locale)
        .catch(() => {})
        .finally(() => {
          if (active) setMounted(true);
        });
    } else {
      const t = setTimeout(() => active && setMounted(true), 0);
      return () => {
        active = false;
        clearTimeout(t);
        window.removeEventListener("scroll", handleScroll);
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const navLinks = [
    { href: `/${locale}`, label: t("nav_home") },
    { href: `/${locale}/about`, label: t("nav_about") },
    { href: `/${locale}/services`, label: t("nav_services") },
    { href: `/${locale}/properties`, label: t("nav_properties") },
    { href: `/${locale}/blog`, label: t("nav_blog") },
  ];

  return (
    <>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="hidden md:block bg-slate-900/90 border-b border-white/5"
      >
        <div className="container flex items-center justify-between py-2.5 min-h-12">
          <div className="flex items-center gap-8 text-xs leading-relaxed text-white/50">
            <a
              href="mailto:info@homeverse.com"
              className="flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              info@homeverse.com
            </a>
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t("address")}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {[
              { Icon: FaFacebookF, href: "#" },
              { Icon: FaTwitter, href: "#" },
              { Icon: FaInstagram, href: "#" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-orange-400 transition-colors"
              >
                <social.Icon className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <header
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
            : "bg-slate-950/80 backdrop-blur-md"
        }`}
      >
        <div className="container flex items-center justify-between py-4 min-h-[5rem] gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group flex-shrink-0 min-w-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all flex-shrink-0">
              <HiOutlineHome className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight leading-none">
              Home<span className="text-orange-500">verse</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-nowrap min-w-max justify-center">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== `/${locale}` && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative inline-flex shrink-0 whitespace-nowrap px-4 py-2.5 text-[13px] font-medium tracking-wide leading-none transition-colors ${
                    isActive
                      ? "text-orange-400"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(232,101,26,0.35)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium leading-none text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  <span>{user?.first_name || t("nav_dashboard")}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium leading-none text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  <span>{t("nav_logout")}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium leading-none text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <HiOutlineLogin className="w-4 h-4" />
                  <span>{t("nav_login")}</span>
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="btn-primary !py-2.5 !px-5 !text-[13px] !gap-1.5 !rounded-lg"
                >
                  <HiOutlineUser className="w-3.5 h-3.5" />
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <HiOutlineX className="w-5 h-5" />
            ) : (
              <HiOutlineMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-t border-white/5 animate-fade-in">
            <div className="container py-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-black/25 space-y-4">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/30">
                      Menu
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {locale === "ar" ? "تصفح سريع" : "Quick navigation"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    <HiOutlineHome className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between gap-4 px-4 py-4 rounded-2xl text-sm font-medium leading-relaxed transition-all border ${
                          isActive
                            ? "text-orange-300 bg-orange-500/12 border-orange-500/20 shadow-[0_0_0_1px_rgba(232,101,26,0.12)]"
                            : "text-white/75 bg-white/[0.03] border-white/5 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive
                              ? "bg-orange-400 shadow-[0_0_10px_rgba(232,101,26,0.65)]"
                              : "bg-white/15"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/30 px-1">
                    {locale === "ar" ? "اللغة" : "Language"}
                  </p>
                  <LanguageSwitcher />
                </div>

                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-4 rounded-2xl text-sm font-medium leading-relaxed text-white/70 bg-white/[0.03] border border-white/5 hover:text-white hover:bg-white/[0.06]"
                    >
                      {t("nav_dashboard")}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-4 rounded-2xl text-sm font-medium leading-relaxed text-red-300 bg-red-500/10 border border-red-500/15 hover:bg-red-500/15"
                    >
                      {t("nav_logout")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl text-sm font-medium leading-relaxed text-white/75 bg-white/[0.03] border border-white/5 hover:text-white hover:bg-white/[0.06]"
                    >
                      <span>{t("nav_login")}</span>
                      <HiOutlineLogin className="w-4 h-4 text-white/30" />
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl text-sm font-medium leading-relaxed text-orange-300 bg-orange-500/10 border border-orange-500/15 hover:bg-orange-500/15"
                    >
                      <span>{t("nav_register")}</span>
                      <HiOutlineUser className="w-4 h-4 text-orange-300/80" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
