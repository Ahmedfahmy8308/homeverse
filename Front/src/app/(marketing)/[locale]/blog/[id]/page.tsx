// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { blogApi } from "@/lib/api";
import type { BlogPost } from "@/lib/types";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue } from "@/lib/i18n/localized";
import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineUser,
} from "react-icons/hi";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const id = parseInt(params?.id as string);
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);

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
        const res = await blogApi.getPost(id);
        if (active) setPost((res.data as BlogPost) || null);
      } catch (e) {
        console.warn("Failed to load blog post", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (!mounted) return null;

  if (!post) {
    return (
      <section className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("blog_post_not_found_title")}
          </h1>
          <p className="text-white/60 mb-8">{t("blog_post_not_found_text")}</p>
          <Link href={`/${locale}/blog`} className="btn-primary">
            {t("blog_back_to_blog")}
          </Link>
        </div>
      </section>
    );
  }

  const getTitle = (p: BlogPost) => getLocalizedValue(p.title, locale);
  const getExcerpt = (p: BlogPost) => getLocalizedValue(p.excerpt, locale);
  const getCategory = (p: BlogPost) => getLocalizedValue(p.category, locale);
  const getAuthor = (p: BlogPost) => getLocalizedValue(p.author, locale);
  const getContent = (p: BlogPost) => getLocalizedValue(p.content, locale);

  if (!post) {
    return (
      <section className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("blog_post_not_found_title")}
          </h1>
          <p className="text-white/60 mb-8">{t("blog_post_not_found_text")}</p>
          <Link href={`/${locale}/blog`} className="btn-primary">
            {t("blog_back_to_blog")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="py-20 bg-linear-to-b from-slate-900/50 to-transparent">
        <div className="container animate-fade-in-up">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            {t("blog_back_to_blog")}
          </Link>
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
              <span className="badge badge-blue">{getCategory(post)}</span>
              <div className="flex items-center gap-1">
                <HiOutlineClock className="w-4 h-4" />
                {post.readTime} {t("blog_read_suffix")}
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineUser className="w-4 h-4" />
                {getAuthor(post)}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {getTitle(post)}
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              {getExcerpt(post)}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-2xl mb-8">
              <div className="relative w-full h-96 rounded-xl mb-8 overflow-hidden">
                <Image
                  src={post.image}
                  alt={getTitle(post)}
                  fill
                  sizes="(min-width:1024px) 100vw, 100vw"
                  className="object-cover"
                  loading="eager"
                  priority
                />
              </div>
              <div className="prose prose-lg prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: getContent(post) }} />
              </div>
            </div>

            {/* ─── Author ─── */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.authorAvatar}
                    alt={getAuthor(post)}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {getAuthor(post)}
                  </h3>
                  <p className="text-sm text-white/60">
                    {t("blog_published_on")} {post.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
