// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  BlogPost,
  BlogFilters,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from "./index";

import { blogPosts } from "../../mock/blog.mock";

function appendJsonField(formData: FormData, key: string, value: unknown) {
  formData.append(key, JSON.stringify(value));
}

function buildBlogFormData(data: CreateBlogPostDto | UpdateBlogPostDto) {
  const formData = new FormData();

  if (data.title !== undefined) appendJsonField(formData, "title", data.title);
  if (data.excerpt !== undefined)
    appendJsonField(formData, "excerpt", data.excerpt);
  if (data.content !== undefined)
    appendJsonField(formData, "content", data.content);
  if (data.category !== undefined)
    appendJsonField(formData, "category", data.category);
  if (data.author_name !== undefined)
    appendJsonField(formData, "author_name", data.author_name);
  if (data.tags !== undefined) appendJsonField(formData, "tags", data.tags);

  if (data.slug !== undefined) formData.append("slug", data.slug);
  if (data.image_url !== undefined)
    formData.append("image_url", data.image_url);
  if (data.image_file instanceof Blob)
    formData.append("image_file", data.image_file);
  if (data.author_avatar !== undefined)
    formData.append("author_avatar", data.author_avatar);
  if (data.read_time !== undefined)
    formData.append("read_time", data.read_time);
  if (data.is_published !== undefined)
    formData.append("is_published", data.is_published ? "1" : "0");
  if (data.published_at !== undefined)
    formData.append("published_at", data.published_at);

  return formData;
}

export class BlogApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  private withFallback<T>(
    apiCall: Promise<ApiResponse<T>>,
    fallbackData: T,
  ): Promise<ApiResponse<T>> {
    return apiCall.catch((error) => {
      console.warn("API call failed, falling back to mock data:", error);
      return {
        success: true,
        isSuccess: true,
        message: "Loaded from mock data",
        data: fallbackData,
      };
    });
  }

  /** List published blog posts */
  async listPosts(filters?: BlogFilters): Promise<ApiResponse<BlogPost[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
    }
    const qs = params.toString();
    return this.withFallback(
      this.get<BlogPost[]>(`/blog-posts${qs ? `?${qs}` : ""}`),
      blogPosts as unknown as BlogPost[],
    );
  }

  /** Get a single blog post by ID */
  async getPost(id: number): Promise<ApiResponse<BlogPost>> {
    return this.withFallback(
      this.get<BlogPost>(`/blog-posts/${id}`),
      blogPosts.find((p) => p.id === id) as unknown as BlogPost,
    );
  }

  /** Get a single blog post by slug */
  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.get<BlogPost>(`/blog-posts/slug/${slug}`);
  }

  // ── Admin endpoints ──

  /** Create a new blog post (admin) */
  async createPost(data: CreateBlogPostDto): Promise<ApiResponse<BlogPost>> {
    return this.post<BlogPost, FormData>(
      "/admin/blog-posts",
      buildBlogFormData(data),
    );
  }

  /** Update a blog post (admin) */
  async updatePost(
    id: number,
    data: UpdateBlogPostDto,
  ): Promise<ApiResponse<BlogPost>> {
    return this.put<BlogPost, FormData>(
      `/admin/blog-posts/${id}`,
      buildBlogFormData(data),
    );
  }

  /** Delete a blog post (admin) */
  async deletePost(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/blog-posts/${id}`);
  }

  /** List all blog posts (admin) */
  async listAdminBlogPosts(): Promise<ApiResponse<BlogPost[]>> {
    return this.get<BlogPost[]>("/admin/blog-posts");
  }
}
