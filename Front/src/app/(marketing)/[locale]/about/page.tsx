// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import { useParams } from "next/navigation";
import { propertiesApi } from "@/lib/api";
import { getLocalizedValue } from "@/lib/i18n/localized";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import type { PropertyAgent } from "@/lib/types";
import {
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineGlobe,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { HiOutlineBuildingOffice, HiOutlineHandThumbUp } from "react-icons/hi2";
import { FaStar } from "react-icons/fa";

export default function AboutPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [mounted, setMounted] = useState(false);
  const [agentsData, setAgentsData] = useState<PropertyAgent[]>([]);

  useEffect(() => {
    let active = true;

    if (locale) {
      import("@/lib/i18n")
        .then((module) => {
          const i18nInstance = module.default;
          return i18nInstance.changeLanguage(locale);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setMounted(true);
        });
    } else {
      const t = setTimeout(() => active && setMounted(true), 0);
      return () => clearTimeout(t);
    }

    (async () => {
      try {
        const res = await propertiesApi.listAgents();
        if (active) setAgentsData((res.data as PropertyAgent[]) || []);
      } catch (e) {
        console.warn("Failed to load agents", e);
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const stats = [
    {
      value: "2,500+",
      labelKey: "stats_happy_customers",
      icon: HiOutlineUserGroup,
    },
    {
      value: "1,800+",
      labelKey: "stats_properties",
      icon: HiOutlineBuildingOffice,
    },
    { value: "25+", labelKey: "stats_awards", icon: HiOutlineStar },
    { value: "120+", labelKey: "stats_agents", icon: HiOutlineHandThumbUp },
  ];

  const values = [
    {
      icon: HiOutlineCheckCircle,
      titleKey: "about_value_transparency_title",
      descKey: "about_value_transparency_desc",
    },
    {
      icon: HiOutlineShieldCheck,
      titleKey: "about_value_trust_title",
      descKey: "about_value_trust_desc",
    },
    {
      icon: HiOutlineGlobe,
      titleKey: "about_value_expertise_title",
      descKey: "about_value_expertise_desc",
    },
    {
      icon: HiOutlineStar,
      titleKey: "about_value_client_title",
      descKey: "about_value_client_desc",
    },
  ];

  const timeline = [
    {
      year: "2010",
      titleKey: "timeline_2010_title",
      descKey: "timeline_2010_desc",
    },
    {
      year: "2014",
      titleKey: "timeline_2014_title",
      descKey: "timeline_2014_desc",
    },
    {
      year: "2018",
      titleKey: "timeline_2018_title",
      descKey: "timeline_2018_desc",
    },
    {
      year: "2022",
      titleKey: "timeline_2022_title",
      descKey: "timeline_2022_desc",
    },
    {
      year: "2025",
      titleKey: "timeline_2025_title",
      descKey: "timeline_2025_desc",
    },
  ];

  const getAgentName = (a: PropertyAgent) => getLocalizedValue(a.name, locale);

  return (
    <>
      <Hero
        title={t("about_title")}
        subtitle={t("about_subtitle")}
        ctaLabel={t("about_cta")}
        ctaHref={`/${locale}/contact`}
        image="/images/ui-imported/ui-81481d4d53.png"
      />

      {/* Stats */}
      <section className="py-20 bg-slate-900/50">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-7">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="card p-10 text-center group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <stat.icon className="w-7 h-7 text-orange-400" />
              </div>
              <p className="text-3xl font-bold gradient-text mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-white/40">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("about_features_subtitle")}
            </p>
            <h2 className="section-title text-white">
              {t("about_features_title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-7">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="card p-10 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <v.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {t(v.titleKey)}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {t(v.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-900/50">
        <div className="container max-w-3xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("timeline_subtitle")}
            </p>
            <h2 className="section-title text-white">{t("timeline_title")}</h2>
          </div>
          <div className="relative">
            <div
              className={`absolute ${locale === "ar" ? "right-6" : "left-6"} top-0 bottom-0 w-px bg-white/10`}
            />
            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative ${locale === "ar" ? "pr-24" : "pl-24"} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={`absolute ${locale === "ar" ? "right-0" : "left-0"} top-6 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/20 z-10`}
                  >
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div className="card p-7">
                    <h4 className="text-base font-semibold text-white mb-3">
                      {t(item.titleKey)}
                    </h4>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              <HiOutlineUserGroup className="w-4 h-4" /> {t("team_subtitle")}
            </p>
            <h2 className="section-title text-white">{t("team_title")}</h2>
            <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
              {t("team_text")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {agentsData.map((agent, idx) => (
              <div
                key={agent.id}
                className="card p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 transition-colors">
                  <Image
                    src={agent.avatar}
                    alt={getAgentName(agent)}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  {getAgentName(agent)}
                </h4>
                <p className="text-xs text-white/40 mb-4">
                  {t("estate_agent")}
                </p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs text-white/60">
                    {agent.rating} {t("agent_rating")}
                  </span>
                </div>
                <p className="text-xs text-orange-400 font-medium">
                  {agent.propertiesSold} {t("agent_properties_sold")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA
        title={t("cta_title")}
        description={t("cta_text")}
        primaryLabel={t("cta_button")}
        primaryHref={`/${locale}/properties`}
      />
    </>
  );
}
