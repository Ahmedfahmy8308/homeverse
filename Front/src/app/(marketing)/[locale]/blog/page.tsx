// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { blogApi } from "@/lib/api";
import type { BlogPost } from "@/lib/types";
import Hero from "@/components/Hero";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";

export default function BlogPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const [mounted, setMounted] = useState(false);
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
      const t = setTimeout(() => active && setMounted(true), 0);
      return () => clearTimeout(t);
    }

    return () => {
      active = false;
    };
  }, [locale]);

  // fetch posts
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await blogApi.listPosts();
        if (active) setPosts((res.data as BlogPost[]) || []);
      } catch (e) {
        console.warn("Failed to load blog posts", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!mounted) return null;

  const getTitle = (p: BlogPost) => getLocalizedValue(p.title, locale);
  const getExcerpt = (p: BlogPost) => getLocalizedValue(p.excerpt, locale);
  const getCategory = (p: BlogPost) => getLocalizedValue(p.category, locale);
  const getAuthor = (p: BlogPost) => getLocalizedValue(p.author, locale);

  return (
    <>
      <Hero
        title={t("blog_title")}
        subtitle={t("blog_subtitle")}
        ctaLabel={t("blog_cta")}
        ctaHref={`/${locale}/blog`}
        image={posts[0]?.image}
      />

      {/* ─── Blog ─── */}
      <section className="py-10 bg-slate-900/50">
        <div className="container text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {t("blog_intro_title")}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("blog_intro")}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.id}`}
              className="card group animate-fade-in-up block"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative overflow-hidden h-56">
                <Image
                  src={post.image}
                  alt={getTitle(post)}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="eager"
                  priority
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
                  <span className="badge badge-blue">{getCategory(post)}</span>
                  <span>{post.readTime} read</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {getTitle(post)}
                </h3>
                <p className="text-xs text-white/40 mb-5 line-clamp-2 leading-relaxed">
                  {getExcerpt(post)}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden">
                    <Image
                      src={post.authorAvatar}
                      alt={getAuthor(post)}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-white/50">
                    {getAuthor(post)}
                  </span>
                  <span className="text-xs text-white/20 ml-auto">
                    {post.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
