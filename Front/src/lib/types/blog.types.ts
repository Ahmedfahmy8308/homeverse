// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

/* ─── Blog API Types ─── */
import type { LocalizedValue } from "./index";

export interface BlogPost {
  id: number;
  title: LocalizedValue<string>;
  excerpt: LocalizedValue<string>;
  content: LocalizedValue<string>;
  category: LocalizedValue<string>;
  author: LocalizedValue<string>;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  tags: LocalizedValue<string[]>;
}

export interface BlogFilters {
  limit?: number;
  category?: string;
  all?: boolean; // admin: show unpublished too
}

export interface CreateBlogPostDto {
  title: LocalizedValue<string>;
  slug?: string;
  excerpt: LocalizedValue<string>;
  content: LocalizedValue<string>;
  category: LocalizedValue<string>;
  author_name: LocalizedValue<string>;
  tags: LocalizedValue<string[]>;
  image_url?: string;
  image_file?: File | Blob;
  author_avatar?: string;
  read_time?: string;
  is_published?: boolean;
  published_at?: string;
}

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>;
