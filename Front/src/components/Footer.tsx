// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getLocaleFromPathname } from "@/lib/i18n/locale-config";
import {
  HiOutlineHome,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { locale } = getLocaleFromPathname(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
      };
    }

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const companyLinks = [
    { href: `/${locale}/about`, label: t("footer_about") },
    { href: `/${locale}/blog`, label: t("footer_blog") },
    { href: `/${locale}/faq`, label: t("footer_faq") },
    { href: `/${locale}/contact`, label: t("footer_contact") },
  ];

  const serviceLinks = [
    { href: `/${locale}/services`, label: t("footer_services") },
    { href: `/${locale}/properties?type=rent`, label: t("footer_wishlist") },
    { href: `/${locale}/dashboard`, label: t("footer_my_account") },
    { href: `/${locale}/terms`, label: t("footer_terms") },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20">
      <div className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                <HiOutlineHome className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Home<span className="text-orange-500">verse</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              {t("footer_description")}
            </p>
          </div>

          {/* Contact Column */}
          <div className="lg:pl-4">
            <h4 className="text-white font-semibold text-base mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t("footer_contact")}
            </h4>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-orange-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors shrink-0">
                  <HiOutlineLocationMarker className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">{t("address")}</span>
              </a>
              <a
                href="tel:01015205654"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-orange-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors shrink-0">
                  <HiOutlinePhone className="w-4 h-4" />
                </div>
                <span>{t("phone")}</span>
              </a>
              <a
                href="mailto:info@homeverse.com"
                className="flex items-center gap-3 text-sm text-white/40 hover:text-orange-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors shrink-0">
                  <HiOutlineMail className="w-4 h-4" />
                </div>
                <span className="truncate">info@homeverse.com</span>
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="lg:pl-4">
            <h4 className="text-white font-semibold text-base mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t("footer_company")}
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-orange-400 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:pl-4">
            <h4 className="text-white font-semibold text-base mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t("footer_services")}
            </h4>
            <ul className="space-y-4">
              {serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-orange-400 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:pl-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full">
              <h4 className="text-white font-semibold text-base mb-3 flex items-center justify-center lg:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t("footer_customer_care")}
              </h4>
              <p className="text-sm text-white/40 mb-3 leading-relaxed max-w-62.5 mx-auto lg:mx-0">
                {t("footer_subscribe_text")}
              </p>
              <form className="relative group max-w-62.5 mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder={t("footer_subscribe_placeholder")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-all shadow-lg shadow-orange-500/20"
                >
                  <HiOutlineMail className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="space-y-3.5 w-full">
              <div className="flex items-center gap-4 max-w-62.5 mx-auto lg:mx-0">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold whitespace-nowrap">
                  {t("contact_follow_us")}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-orange-500 hover:border-orange-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 mt-16">
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 text-[15px] text-white/40 leading-relaxed px-4">
              <div className="flex items-center gap-2">
                {locale === "ar" ? (
                  <>
                    <span>{t("footer_rights")}</span>
                    <span className="dir-ltr inline-block">
                      © {new Date().getFullYear()}
                    </span>
                  </>
                ) : (
                  <>
                    <span>© {new Date().getFullYear()}</span>
                    <span>{t("footer_rights")}</span>
                  </>
                )}
              </div>
              <Link
                href="https://www.ufuq-tech.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 font-bold hover:text-orange-400 transition-all duration-300 inline-flex items-center gap-2 group"
              >
                <span className="text-white/20 font-normal">
                  {t("footer_developed_by")}
                </span>
                {t("company_name")}
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
