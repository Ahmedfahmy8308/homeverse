// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import Image from "next/image";
import Hero from "@/components/Hero";
import Link from "next/link";
import CTA from "@/components/CTA";
import { useParams } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";
import { blogApi, propertiesApi } from "@/lib/api";
import type {
  BlogPost,
  Property,
  PropertyAgent,
  PropertyAmenity,
} from "@/lib/types";
import {
  HiOutlineArrowRight,
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  HiOutlineBuildingOffice,
  HiOutlineKey,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import {
  FaCar,
  FaSwimmingPool,
  FaShieldAlt,
  FaHospital,
  FaBook,
  FaBed,
  FaLaptopHouse,
  FaChild,
  FaStar,
} from "react-icons/fa";

const amenityIcons = [
  FaCar,
  FaSwimmingPool,
  FaShieldAlt,
  FaHospital,
  FaBook,
  FaLaptopHouse,
  FaChild,
  FaBed,
];

export default function HomePage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [mounted, setMounted] = useState(false);
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<PropertyAmenity[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

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
      // defer to next tick to avoid synchronous setState inside effect
      const t = setTimeout(() => active && setMounted(true), 0);
      return () => {
        active = false;
        clearTimeout(t);
      };
    }

    // fetch remote data with fallback to mocks handled by API clients
    (async () => {
      try {
        const [propRes, amenRes, blogRes] = await Promise.all([
          propertiesApi.listProperties(),
          propertiesApi.listAmenities(),
          blogApi.listPosts(),
        ]);
        if (active) {
          setPropertiesData((propRes.data as Property[]) || []);
          setAmenities((amenRes.data as PropertyAmenity[]) || []);
          setPosts((blogRes.data as BlogPost[]) || []);
        }
      } catch (e) {
        console.warn("Failed fetching data for home page", e);
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  if (!mounted) return null;

  const featuredProperties = propertiesData
    .filter((p) => p.featured)
    .slice(0, 4);

  const getPropertyTitle = (p: Property) => getLocalizedValue(p.title, locale);
  const getPropertyLocation = (p: Property) =>
    getLocalizedValue(p.location, locale);
  const getCategory = (p: Property) => getLocalizedValue(p.category, locale);
  const getAgentName = (a: PropertyAgent) => getLocalizedValue(a.name, locale);
  const getBlogTitle = (p: BlogPost) => getLocalizedValue(p.title, locale);
  const getBlogExcerpt = (p: BlogPost) => getLocalizedValue(p.excerpt, locale);
  const getBlogCategory = (p: BlogPost) =>
    getLocalizedValue(p.category, locale);
  const getBlogAuthor = (p: BlogPost) => getLocalizedValue(p.author, locale);

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        title={t("hero_title")}
        subtitle={t("hero_subtitle")}
        ctaLabel={t("hero_cta")}
        ctaHref={`/${locale}/properties`}
        image="/images/ui-imported/ui-569a886410.png"
      />

      {/* ─── Services ─── */}
      <section className="py-24 bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="section-subtitle justify-center">
              {t("service_subtitle")}
            </p>
            <h2 className="section-title text-white">{t("service_title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              {
                icon: HiOutlineBuildingOffice,
                title: t("service_buy_title"),
                text: t("service_buy_text"),
                cta: t("service_buy_cta"),
                color: "from-blue-500/20 to-indigo-500/20",
              },
              {
                icon: HiOutlineKey,
                title: t("service_rent_title"),
                text: t("service_rent_text"),
                cta: t("service_rent_cta"),
                color: "from-emerald-500/20 to-teal-500/20",
              },
              {
                icon: HiOutlineCurrencyDollar,
                title: t("service_sell_title"),
                text: t("service_sell_text"),
                cta: t("service_sell_cta"),
                color: "from-orange-500/20 to-red-500/20",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="card p-10 group animate-fade-in-up hover:border-orange-500/30 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}
                >
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  {s.text}
                </p>
                <Link
                  href={`/${locale}/properties`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {s.cta} <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Properties ─── */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-14">
            <div className="animate-fade-in-up">
              <p className="section-subtitle">{t("property_subtitle")}</p>
              <h2 className="section-title text-white">
                {t("property_title")}
              </h2>
            </div>
            <Link
              href={`/${locale}/properties`}
              className="hidden md:inline-flex btn-secondary !py-2.5 !px-6 !text-sm"
            >
              {t("view_all")} <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {featuredProperties.map((property, idx) => (
              <Link
                key={property.id}
                href={`/${locale}/properties/${property.id}`}
                className="card group animate-fade-in-up block"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative overflow-hidden h-52">
                  <Image
                    src={property.images[0]}
                    alt={getPropertyTitle(property)}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`badge ${property.type === "rent" ? "badge-green" : "badge-orange"}`}
                    >
                      {property.type === "rent" ? t("for_rent") : t("for_sale")}
                    </span>
                    <span className="badge badge-blue">
                      {getCategory(property)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <FaStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-[11px] text-white font-medium">
                      {property.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                    {getPropertyLocation(property)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold gradient-text">
                      {property.currency} {property.price.toLocaleString()}
                    </span>
                    {property.period && (
                      <span className="text-xs text-white/40">
                        {property.period === "/Month"
                          ? t("month")
                          : property.period}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-4 group-hover:text-orange-400 transition-colors line-clamp-1">
                    {getPropertyTitle(property)}
                  </h3>
                  <div className="flex items-center gap-5 text-xs text-white/40 pt-4 border-t border-white/5">
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
                <div className="px-5 pb-5 flex items-center gap-3 border-t border-white/5 pt-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={property.agent.avatar}
                      alt={getAgentName(property.agent)}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/80">
                      {getAgentName(property.agent)}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <p className="text-[10px] text-white/30">
                        {t("estate_agent")}
                      </p>
                      <div className="flex items-center gap-1">
                        <FaStar className="w-2.5 h-2.5 text-yellow-500" />
                        <p className="text-[10px] text-white/50 font-medium">
                          {property.agent.rating} {t("agent_rating")}
                        </p>
                      </div>
                      <p className="text-[10px] text-white/30">
                        {property.agent.propertiesSold}{" "}
                        {t("agent_properties_sold")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section className="py-24 bg-slate-900/50">
        <div className="container grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="relative h-[400px]">
                <Image
                  src="/images/imported/photo-1600210492486-724fe5c67fb0-76a1e628c3.jpg"
                  alt="Interior"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-xl overflow-hidden border-4 border-slate-900 hidden md:block">
              <div className="relative w-full h-full">
                <Image
                  src="/images/imported/photo-1600566753190-17f0baa2a6c3-069e6a50f9.jpg"
                  alt="Interior detail"
                  fill
                  sizes="192px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="animate-fade-in-up delay-200">
            <p className="section-subtitle">{t("about_subtitle")}</p>
            <h2 className="section-title text-white">{t("about_title")}</h2>
            <p className="text-white/40 mb-10 leading-relaxed">
              {t("about_text")}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: HiOutlineHome, text: t("about_smart_home") },
                { icon: HiOutlineStar, text: t("about_beautiful_scene") },
                { icon: HiOutlineStar, text: t("about_lifestyle") },
                { icon: HiOutlineShieldCheck, text: t("about_security") },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <item.icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-white/70">{item.text}</span>
                </div>
              ))}
            </div>
            <blockquote className="text-white/50 italic border-l-2 border-orange-500 pl-5 mb-10 text-sm leading-relaxed">
              {t("about_callout")}
            </blockquote>
            <Link href={`/${locale}/services`} className="btn-primary">
              {t("about_cta")} <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Building Amenities ─── */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="section-subtitle justify-center">
              {t("amenities_subtitle")}
            </p>
            <h2 className="section-title text-white">{t("amenities_title")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, idx) => {
              const Icon = amenityIcons[idx];
              const amenityTitle = getLocalizedValue(amenity.name, locale);
              const amenityDescription = getLocalizedValue(
                amenity.description,
                locale,
              );
              return (
                <div
                  key={amenity.id}
                  className="card group cursor-pointer overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={amenity.image}
                      alt={amenityTitle}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 bg-orange-500/90 rounded-lg flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {amenityTitle}
                    </h4>
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                      {amenityDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Blog ─── */}
      <section className="py-24 bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-16">
            <p className="section-subtitle justify-center">
              {t("blog_subtitle")}
            </p>
            <h2 className="section-title text-white">{t("blog_title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, idx) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.id}`}
                className="card group animate-fade-in-up block"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="relative overflow-hidden h-52">
                  <Image
                    src={post.image}
                    alt={getBlogTitle(post)}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
                    <span className="badge badge-blue">
                      {getBlogCategory(post)}
                    </span>
                    <span>{post.readTime} read</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {getBlogTitle(post)}
                  </h3>
                  <p className="text-xs text-white/40 mb-5 line-clamp-2 leading-relaxed">
                    {getBlogExcerpt(post)}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden">
                      <Image
                        src={post.authorAvatar}
                        alt={getBlogAuthor(post)}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-white/50">
                      {getBlogAuthor(post)}
                    </span>
                    <span className="text-xs text-white/20 ml-auto">
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CTA
        title={t("cta_title")}
        description={t("cta_text")}
        primaryLabel={t("cta_button")}
        primaryHref={`/${locale}/properties`}
      />
    </>
  );
}
