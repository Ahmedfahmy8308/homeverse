// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useParams } from "next/navigation";
import { HiOutlineChevronDown, HiOutlineSearch } from "react-icons/hi";

export default function FAQPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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

  const data = [
    {
      category: t("faq_category_general"),
      items: [
        { q: t("faq_general_q1"), a: t("faq_general_a1") },
        { q: t("faq_general_q2"), a: t("faq_general_a2") },
        { q: t("faq_general_q3"), a: t("faq_general_a3") },
      ],
    },
    {
      category: t("faq_category_buying"),
      items: [
        { q: t("faq_buying_q1"), a: t("faq_buying_a1") },
        { q: t("faq_buying_q2"), a: t("faq_buying_a2") },
        { q: t("faq_buying_q3"), a: t("faq_buying_a3") },
      ],
    },
    {
      category: t("faq_category_selling"),
      items: [
        { q: t("faq_selling_q1"), a: t("faq_selling_a1") },
        { q: t("faq_selling_q2"), a: t("faq_selling_a2") },
      ],
    },
    {
      category: t("faq_category_security"),
      items: [
        { q: t("faq_security_q1"), a: t("faq_security_a1") },
        { q: t("faq_security_q2"), a: t("faq_security_a2") },
      ],
    },
  ];

  const filtered = data
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (i) => !search || i.q.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <>
      <section className="py-20 bg-linear-to-b from-slate-900/50 to-transparent">
        <div className="container text-center animate-fade-in-up">
          <p className="section-subtitle justify-center">{t("faq_subtitle")}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {t("faq_title")}
          </h1>
          <div className="max-w-lg mx-auto relative mt-10">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder={t("faq_search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12!"
            />
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container max-w-3xl space-y-12">
          {filtered.map((cat, ci) => (
            <div
              key={ci}
              className="animate-fade-in-up"
              style={{ animationDelay: `${ci * 100}ms` }}
            >
              <h3 className="text-lg font-semibold text-white mb-5">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  const isOpen = openIdx === key;
                  return (
                    <div key={key} className="card rounded-lg!">
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : key)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/2 transition-colors"
                      >
                        <span className="text-sm font-medium text-white pr-6">
                          {item.q}
                        </span>
                        <HiOutlineChevronDown
                          className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 -mt-1 animate-fade-in">
                          <p className="text-sm text-white/50 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <HiOutlineSearch className="w-12 h-12 text-white/10 mx-auto mb-5" />
              <p className="text-white/40">{t("faq_no_results")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
