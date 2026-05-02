// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useParams } from "next/navigation";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function TermsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
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
      return () => clearTimeout(t);
    }

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const sections = [
    {
      title: t("terms_section_1_title"),
      content: t("terms_section_1_content"),
    },
    {
      title: t("terms_section_2_title"),
      content: t("terms_section_2_content"),
    },
    {
      title: t("terms_section_3_title"),
      content: t("terms_section_3_content"),
    },
    {
      title: t("terms_section_4_title"),
      content: t("terms_section_4_content"),
    },
    {
      title: t("terms_section_5_title"),
      content: t("terms_section_5_content"),
    },
    {
      title: t("terms_section_6_title"),
      content: t("terms_section_6_content"),
    },
    {
      title: t("terms_section_7_title"),
      content: t("terms_section_7_content"),
    },
  ];

  return (
    <>
      <section className="py-20 bg-linear-to-b from-slate-900/50 to-transparent">
        <div className="container text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-5 bg-orange-500/10 rounded-2xl flex items-center justify-center">
            <HiOutlineDocumentText className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {t("terms_title")}
          </h1>
          <p className="text-white/40 text-sm">{t("terms_updated")}</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container max-w-3xl space-y-7">
          {sections.map((s, idx) => (
            <div
              key={idx}
              className="card p-8 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <h3 className="text-base font-semibold text-white mb-4">
                {s.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
