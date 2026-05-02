// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/i18n/localized";
import { propertiesApi } from "@/lib/api";
import type { Property, PropertyAgent } from "@/lib/types";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import {
  FaStar,
  FaCar,
  FaSwimmingPool,
  FaShieldAlt,
  FaHospital,
  FaBook,
  FaLaptopHouse,
  FaChild,
  FaBed,
} from "react-icons/fa";

const amenityIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  am1: FaCar,
  am2: FaSwimmingPool,
  am3: FaShieldAlt,
  am4: FaHospital,
  am5: FaBook,
  am6: FaLaptopHouse,
  am7: FaChild,
  am8: FaBed,
};

export default function PropertyDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const id = Number(params?.id);
  const [mounted, setMounted] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

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

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pRes, listRes] = await Promise.all([
          propertiesApi.getProperty(id),
          propertiesApi.listProperties(),
        ]);
        if (active) {
          setProperty((pRes.data as Property) || null);
          setAllProperties((listRes.data as Property[]) || []);
        }
      } catch (e) {
        console.warn("Failed to load property details", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (!mounted) return null;

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {t("page_not_found")}
          </h1>
          <Link href={`/${locale}/properties`} className="btn-primary">
            {t("go_back")}
          </Link>
        </div>
      </div>
    );
  }
  const getTitle = (p: Property) => getLocalizedValue(p.title, locale);
  const getDescription = (p: Property) =>
    getLocalizedValue(p.description, locale);
  const getAddress = (p: Property) => getLocalizedValue(p.address, locale);
  const getCity = (p: Property) => getLocalizedValue(p.city, locale);
  const getCategory = (p: Property) => getLocalizedValue(p.category, locale);
  const getLocation = (p: Property) => getLocalizedValue(p.location, locale);
  const getAgentName = (a: PropertyAgent) => getLocalizedValue(a.name, locale);

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {t("page_not_found")}
          </h1>
          <Link href={`/${locale}/properties`} className="btn-primary">
            {t("go_back")}
          </Link>
        </div>
      </div>
    );
  }

  const similar = allProperties
    .filter((p) => p.id !== property.id && getCity(p) === getCity(property))
    .slice(0, 3);

  return (
    <>
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-orange-400 transition-colors mb-12"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> {t("go_back")}
          </Link>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-14 lg:mb-16 rounded-2xl overflow-hidden">
            <div className="lg:col-span-2 h-[400px] lg:h-[450px] rounded-xl overflow-hidden relative">
              <Image
                src={property.images[0]}
                alt={getTitle(property)}
                fill
                sizes="(min-width:1024px) 66vw, 100vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
                loading="eager"
                priority
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              {property.images.slice(1, 3).map((img, i) => (
                <div
                  key={i}
                  className="h-[195px] lg:h-[220px] rounded-xl overflow-hidden relative"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-14">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex items-center gap-5 mb-6">
                  <span
                    className={`badge ${property.type === "rent" ? "badge-green" : "badge-orange"}`}
                  >
                    {property.type === "rent" ? t("for_rent") : t("for_sale")}
                  </span>
                  <span className="badge badge-blue">
                    {getCategory(property)}
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      {property.rating}
                    </span>
                    <span className="text-xs text-white/40">
                      ({property.reviewCount} {t("reviews")})
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {getTitle(property)}
                </h1>
                <p className="flex items-center gap-3 text-white/60 mb-6 text-base">
                  <HiOutlineLocationMarker className="w-5 h-5 flex-shrink-0" />{" "}
                  {getAddress(property)}, {getLocation(property)}
                </p>
                <div className="text-4xl lg:text-5xl font-bold gradient-text">
                  {property.currency} {property.price.toLocaleString()}
                  {property.period && (
                    <span className="text-xl text-white/40 font-medium ml-3 rtl:ml-0 rtl:mr-3">
                      {property.period === "/Month"
                        ? t("month")
                        : property.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="card p-8">
                <h3 className="text-xl font-bold text-white mb-8">
                  {t("property_overview")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { labelKey: "property_beds", value: property.beds },
                    { labelKey: "property_baths", value: property.baths },
                    {
                      labelKey: "property_area",
                      value: `${property.area} sqft`,
                    },
                    { labelKey: "property_floors", value: property.floors },
                    {
                      labelKey: "property_year_built",
                      value: property.yearBuilt,
                    },
                    { labelKey: "property_garage", value: property.garage },
                    { labelKey: "property_city", value: getCity(property) },
                    {
                      labelKey: "property_category",
                      value: getCategory(property),
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">
                        {t(item.labelKey)}
                      </p>
                      <p className="text-base lg:text-lg font-bold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="card p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  {t("property_description")}
                </h3>
                <p className="text-white/60 text-base leading-8">
                  {getDescription(property)}
                </p>
              </div>

              {/* Amenities */}
              <div className="card p-8">
                <h3 className="text-xl font-bold text-white mb-8">
                  {t("property_features")}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIconMap[amenity.id] || FaStar;
                    const amenityTitle = getLocalizedValue(
                      amenity.name,
                      locale,
                    );
                    const amenityDescription = getLocalizedValue(
                      amenity.description,
                      locale,
                    );
                    return (
                      <div
                        key={amenity.id}
                        className="flex gap-5 p-5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.05]"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={amenity.image}
                            alt={amenityTitle}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <h4 className="text-base font-semibold text-white">
                              {amenityTitle}
                            </h4>
                          </div>
                          <p className="text-sm text-white/50 line-clamp-2">
                            {amenityDescription}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar - Agent Card */}
            <div className="space-y-6 lg:space-y-8">
              <Card className="p-8 lg:sticky lg:top-24">
                <h3 className="text-lg font-bold text-white mb-7">
                  {t("property_contact_agent")}
                </h3>
                <div className="flex items-center gap-4 mb-7 pb-7 border-b border-white/10">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={property.agent.avatar}
                      alt={getAgentName(property.agent)}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-base">
                      {getAgentName(property.agent)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs text-white/60">
                        {property.agent.rating} {t("agent_rating")}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      {property.agent.propertiesSold}{" "}
                      {t("agent_properties_sold")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mb-7">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-4 text-base text-white/60 hover:text-orange-400 transition-colors group"
                  >
                    <HiOutlinePhone className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />{" "}
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-4 text-base text-white/60 hover:text-orange-400 transition-colors group"
                  >
                    <HiOutlineMail className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />{" "}
                    {property.agent.email}
                  </a>
                </div>
                <Button className="w-full justify-center py-3 text-base font-semibold">
                  {t("agent_send_inquiry")}
                </Button>
              </Card>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-20 pt-16 border-t border-white/10">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-10">
                {t("property_similar")}
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {similar.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${locale}/properties/${p.id}`}
                    className="group block"
                  >
                    <Card className="overflow-hidden hover:border-orange-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-400/10">
                      <div className="relative overflow-hidden h-52">
                        <Image
                          src={p.images[0]}
                          alt={getTitle(p)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span
                          className={`absolute top-4 left-4 badge ${p.type === "rent" ? "badge-green" : "badge-orange"}`}
                        >
                          {p.type === "rent" ? t("for_rent") : t("for_sale")}
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-xl font-bold gradient-text mb-3">
                          {p.currency} {p.price.toLocaleString()}
                          {p.period}
                        </p>
                        <h4 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors mb-3 line-clamp-2">
                          {getTitle(p)}
                        </h4>
                        <p className="text-sm text-white/50">
                          {p.beds} {t("property_beds")} · {p.baths}{" "}
                          {t("property_baths")} · {p.area} {t("square_ft")}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
