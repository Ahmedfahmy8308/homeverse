// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  NewsletterSubscriber,
  SubscribeNewsletterDto,
  UpdateSubscriberDto,
  NewsletterFilters,
} from "../../types/newsletter.types";

export class NewsletterApiClient extends BaseApiClient {
  async createSubscription(
    data: SubscribeNewsletterDto,
  ): Promise<ApiResponse<{ subscribed: boolean; email: string }>> {
    return this.post("/newsletter/subscribe", data);
  }

  async subscribeNewsletter(
    email: string,
  ): Promise<ApiResponse<{ subscribed: boolean; email: string }>> {
    return this.createSubscription({ email });
  }

  async unsubscribeNewsletter(email: string): Promise<ApiResponse<void>> {
    return this.post<void, { email: string }>("/newsletter/unsubscribe", {
      email,
    });
  }

  async listSubscribers(
    filters?: NewsletterFilters,
  ): Promise<ApiResponse<NewsletterSubscriber[]>> {
    this.assertRole(["admin"]);
    const params = new URLSearchParams();
    if (filters?.is_active !== undefined)
      params.set("is_active", filters.is_active ? "1" : "0");
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.per_page !== undefined)
      params.set("per_page", String(filters.per_page));
    const qs = params.toString();
    return this.get<NewsletterSubscriber[]>(
      `/admin/newsletter/subscribers${qs ? `?${qs}` : ""}`,
    );
  }

  async getSubscriber(id: number): Promise<ApiResponse<NewsletterSubscriber>> {
    this.assertRole(["admin"]);
    return this.get<NewsletterSubscriber>(
      `/admin/newsletter/subscribers/${id}`,
    );
  }

  async updateSubscriber(
    id: number,
    data: UpdateSubscriberDto,
  ): Promise<ApiResponse<NewsletterSubscriber>> {
    this.assertRole(["admin"]);
    return this.put<NewsletterSubscriber, UpdateSubscriberDto>(
      `/admin/newsletter/subscribers/${id}`,
      data,
    );
  }

  async deleteSubscriber(id: number): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.delete<void>(`/admin/newsletter/subscribers/${id}`);
  }
}
