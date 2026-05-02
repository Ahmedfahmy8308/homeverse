// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { generalApi } from "@/lib/api";
import type { WishlistProperty } from "@/lib/types";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";
import { HiOutlineHeart, HiOutlineTrash } from "react-icons/hi";

export default function UserFavoritesPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [items, setItems] = useState<WishlistProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    if (isLoading) {
      return () => {
        active = false;
      };
    }

    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return () => {
        active = false;
      };
    }

    void (async () => {
      try {
        const res = await generalApi.getWishlist();
        if (active) {
          setItems((res.data as WishlistProperty[]) || []);
        }
      } catch (error) {
        console.warn("Failed to load favorites", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading, locale, router]);

  const removeFavorite = async (propertyId: number) => {
    setRemovingId(propertyId);
    try {
      await generalApi.deleteWishlistItem(propertyId);
      setItems((current) => current.filter((item) => item.id !== propertyId));
    } catch (error) {
      console.warn("Failed to remove favorite", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading || !isAuthenticated) return null;

  const getTitle = (item: WishlistProperty) =>
    getLocalizedValue(item.title, locale);
  const getDescription = (item: WishlistProperty) =>
    getLocalizedValue(item.description, locale);
  const getLocation = (item: WishlistProperty) =>
    getLocalizedValue(item.location_label, locale);
  const getCity = (item: WishlistProperty) =>
    getLocalizedValue(item.city, locale);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">
        {t("dashboard_favorites")}
      </h2>
      {loading ? (
        <div className="card p-12 text-center text-white/50">
          {t("loading")}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <HiOutlineHeart className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {t("dashboard_no_favorites_title")}
          </h3>
          <p className="text-white/40 text-sm">
            {t("dashboard_no_favorites_text")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <Link href={`/${locale}/properties/${item.id}`} className="block">
                <div className="relative h-52 bg-slate-900/80">
                  <Image
                    src={
                      item.images[0]?.image_url ||
                      "/images/ui-imported/ui-569a886410.png"
                    }
                    alt={getTitle(item)}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white line-clamp-1">
                      {getTitle(item)}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 line-clamp-1">
                      {getLocation(item)}, {getCity(item)}
                    </p>
                  </div>
                  <span
                    className={`badge ${item.listing_type === "rent" ? "badge-green" : "badge-orange"}`}
                  >
                    {item.listing_type}
                  </span>
                </div>
                <p className="text-sm text-white/50 line-clamp-2">
                  {getDescription(item)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <p className="text-sm font-semibold text-white">
                    {item.currency} {item.price.toLocaleString()}
                    {item.price_period ? (
                      <span className="text-white/40 font-normal ml-1">
                        {item.price_period}
                      </span>
                    ) : null}
                  </p>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    disabled={removingId === item.id}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    {removingId === item.id ? t("loading") : t("admin_delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
