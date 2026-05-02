// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/guards";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Card from "@/components/Card";
import { blogApi } from "@/lib/api";
import type { AdminBlogPostSummary } from "@/lib/types";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";

export default function AdminBlogPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<AdminBlogPostSummary[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await blogApi.listAdminBlogPosts();
        if (active) setPosts((res.data as AdminBlogPostSummary[]) || []);
      } catch (e) {
        console.warn("Failed to load admin blog posts", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const getTitle = (post: AdminBlogPostSummary) =>
    getLocalizedValue(post.title, locale);
  const getCategory = (post: AdminBlogPostSummary) =>
    getLocalizedValue(post.category, locale);

  return (
    <RoleGuard roles="admin">
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t("admin_blog")}</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary !py-2 !px-5 !text-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> {t("admin_add_post")}
          </button>
        </div>

        {showForm && (
          <div className="card p-8 animate-scale-in">
            <h3 className="text-lg font-semibold text-white mb-7">
              {t("admin_add_post")}
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_post_title")}
                </label>
                <input className="input" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_post_category")}
                </label>
                <input className="input" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_post_date")}
                </label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_post_image")}
                </label>
                <input type="file" className="input" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_post_excerpt")}
                </label>
                <textarea rows={4} className="input resize-none" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  className="btn-secondary !py-2 !px-4 !text-sm"
                  onClick={() => setShowForm(false)}
                >
                  {t("admin_reset")}
                </button>
                <button className="btn-primary !py-2 !px-4 !text-sm">
                  {t("admin_save_post")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {getTitle(post)}
                      </h4>
                      <p className="text-xs text-white/50">{post.date}</p>
                    </div>
                    <span className="badge badge-blue">
                      {getCategory(post)}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded hover:bg-white/5 text-blue-400">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded hover:bg-red-500/10 text-red-400">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
