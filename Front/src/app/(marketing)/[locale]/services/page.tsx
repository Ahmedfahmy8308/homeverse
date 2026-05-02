// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlinePhone,
} from "react-icons/hi";
import {
  HiOutlineBuildingOffice,
  HiOutlineKey,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import Link from "next/link";
import { useParams } from "next/navigation";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import CTA from "@/components/CTA";

export default function ServicesPage() {
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

  const mainServices = [
    {
      icon: HiOutlineBuildingOffice,
      title: t("service_buy_title"),
      text: t("service_buy_text"),
      color: "from-blue-500/20 to-blue-600/20",
      features: [
        t("service_buy_feature_1"),
        t("service_buy_feature_2"),
        t("service_buy_feature_3"),
        t("service_buy_feature_4"),
      ],
    },
    {
      icon: HiOutlineKey,
      title: t("service_rent_title"),
      text: t("service_rent_text"),
      color: "from-green-500/20 to-green-600/20",
      features: [
        t("service_rent_feature_1"),
        t("service_rent_feature_2"),
        t("service_rent_feature_3"),
        t("service_rent_feature_4"),
      ],
    },
    {
      icon: HiOutlineCurrencyDollar,
      title: t("service_sell_title"),
      text: t("service_sell_text"),
      color: "from-orange-500/20 to-orange-600/20",
      features: [
        t("service_sell_feature_1"),
        t("service_sell_feature_2"),
        t("service_sell_feature_3"),
        t("service_sell_feature_4"),
      ],
    },
  ];

  const additionalServices = [
    {
      icon: HiOutlineDocumentText,
      title: t("service_additional_management_title"),
      text: t("service_additional_management_text"),
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      icon: HiOutlineChartBar,
      title: t("service_additional_analysis_title"),
      text: t("service_additional_analysis_text"),
      color: "from-cyan-500/20 to-cyan-600/20",
    },
    {
      icon: HiOutlineUserGroup,
      title: t("service_additional_consultation_title"),
      text: t("service_additional_consultation_text"),
      color: "from-pink-500/20 to-pink-600/20",
    },
  ];

  const process = [
    {
      step: "01",
      title: t("service_process_1_title"),
      desc: t("service_process_1_desc"),
    },
    {
      step: "02",
      title: t("service_process_2_title"),
      desc: t("service_process_2_desc"),
    },
    {
      step: "03",
      title: t("service_process_3_title"),
      desc: t("service_process_3_desc"),
    },
    {
      step: "04",
      title: t("service_process_4_title"),
      desc: t("service_process_4_desc"),
    },
    {
      step: "05",
      title: t("service_process_5_title"),
      desc: t("service_process_5_desc"),
    },
    {
      step: "06",
      title: t("service_process_6_title"),
      desc: t("service_process_6_desc"),
    },
  ];

  return (
    <>
      <Hero
        title={t("service_title")}
        subtitle={t("service_subtitle")}
        ctaLabel={t("service_hero_cta")}
        ctaHref={`/${locale}/properties`}
        image="/images/ui-imported/ui-8dc5fa6ad0.png"
      />

      {/* ─── Services ─── */}
      <section className="py-10 bg-slate-900/50">
        <div className="container text-center">
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("service_intro")}
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-8">
            <Link href={`/${locale}/properties`} className="btn-primary">
              {t("service_browse_properties")}{" "}
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${locale}/contact`} className="btn-secondary">
              <HiOutlinePhone className="w-4 h-4" />{" "}
              {t("service_free_consultation")}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("service_core_subtitle")}
            </p>
            <h2 className="section-title text-white">
              {t("service_core_title")}
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {mainServices.map((service, idx) => (
              <Card
                key={idx}
                className="p-10 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className={`w-18 h-18 mb-8 bg-linear-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  style={{ width: "72px", height: "72px" }}
                >
                  <service.icon className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  {service.text}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-center gap-3 text-sm text-white/50"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4 text-green-400 shrink-0" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/properties`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {t("learn_more")} <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("service_process_subtitle")}
            </p>
            <h2 className="section-title text-white">
              {t("service_process_title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {process.map((p, idx) => (
              <Card
                key={idx}
                className="p-8 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="text-5xl font-bold text-white/5 block mb-5">
                  {p.step}
                </span>
                <h4 className="text-base font-semibold text-white mb-3">
                  {p.title}
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">
                  {p.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("service_additional_subtitle")}
            </p>
            <h2 className="section-title text-white">
              {t("service_additional_title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, idx) => (
              <Card
                key={idx}
                className="p-10 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 mb-7 bg-linear-to-br ${service.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <service.icon className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {service.text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA
        title={t("service_cta_title")}
        description={t("service_cta_text")}
        primaryLabel={t("service_contact_us")}
        primaryHref={`/${locale}/contact`}
        secondaryLabel={t("service_call_phone")}
        secondaryHref="tel:01015205654"
        secondaryIcon={HiOutlinePhone}
        isExternal={true}
      />
    </>
  );
}
