// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useParams } from "next/navigation";
import Link from "next/link";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";
import {
  HiOutlineSearch,
  HiOutlineAdjustments,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { propertiesApi } from "@/lib/api";
import type { Property, PropertyAgent } from "@/lib/types";

export default function PropertiesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);

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

    (async () => {
      try {
        const res = await propertiesApi.listProperties();
        if (active) setPropertiesData((res.data as Property[]) || []);
      } catch (e) {
        console.warn("Failed to load properties", e);
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const getTitle = (p: Property) => getLocalizedValue(p.title, locale);
  const getDescription = (p: Property) =>
    getLocalizedValue(p.description, locale);
  const getLocation = (p: Property) => getLocalizedValue(p.location, locale);
  const getAgentName = (a: PropertyAgent) => getLocalizedValue(a.name, locale);

  const filtered = propertiesData.filter((p) => {
    const matchType = filter === "all" || p.type === filter;
    const matchSearch =
      !search ||
      getTitle(p).toLowerCase().includes(search.toLowerCase()) ||
      getLocation(p).toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
      <Hero
        title={t("property_title")}
        subtitle={t("property_subtitle")}
        ctaLabel={t("view_all")}
        ctaHref={`/${locale}/properties`}
        image={propertiesData[0]?.images?.[0]}
      />

      <section className="py-8">
        <div className="container">
          <div className="max-w-2xl mx-auto animate-fade-in-up mb-8">
            <div className="relative flex items-center gap-3">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder={t("property_search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input !pl-12"
              />
              <div className="ml-auto flex items-center gap-3">
                <HiOutlineAdjustments className="w-5 h-5 text-white/40" />
                {["all", "rent", "sale"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      filter === f
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {f === "all"
                      ? t("property_filter_all")
                      : f === "rent"
                        ? t("property_filter_rent")
                        : t("property_filter_sale")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/40 text-lg">
                {t("property_no_results")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((property, idx) => (
                <Link
                  key={property.id}
                  href={`/${locale}/properties/${property.id}`}
                  className="group animate-fade-in-up block"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Card className="p-0 overflow-hidden">
                    <div className="relative overflow-hidden h-60">
                      <Image
                        src={property.images[0]}
                        alt={getTitle(property)}
                        fill
                        sizes="(min-width:1024px) 33vw, 100vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`badge ${property.type === "rent" ? "badge-green" : "badge-orange"}`}
                        >
                          {property.type === "rent"
                            ? t("for_rent")
                            : t("for_sale")}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-[11px] text-white font-medium">
                          {property.rating}
                        </span>
                        <span className="text-[10px] text-white/50">
                          ({property.reviewCount})
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold gradient-text">
                          {property.currency} {property.price.toLocaleString()}
                        </span>
                        {property.period && (
                          <span className="text-sm text-white/40">
                            {property.period === "/Month"
                              ? t("month")
                              : property.period}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-1">
                        {getTitle(property)}
                      </h3>
                      <p className="text-sm text-white/40 mb-4 flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0" />{" "}
                        {getLocation(property)}
                      </p>
                      <p className="text-xs text-white/30 mb-5 line-clamp-2 leading-relaxed">
                        {getDescription(property)}
                      </p>
                      <div className="flex items-center gap-5 text-sm text-white/40 pt-5 border-t border-white/5">
                        <span>
                          {property.beds} {t("property_beds")}
                        </span>
                        <span>
                          {property.baths} {t("property_baths")}
                        </span>
                        <span>
                          {property.area} {t("square_ft")}
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex items-center gap-4 border-t border-white/5 pt-5">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden">
                        <Image
                          src={property.agent.avatar}
                          alt={getAgentName(property.agent)}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80">
                          {getAgentName(property.agent)}
                        </p>
                        <p className="text-[11px] text-white/30 mt-0.5">
                          {property.agent.propertiesSold}{" "}
                          {t("agent_properties_sold")}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
