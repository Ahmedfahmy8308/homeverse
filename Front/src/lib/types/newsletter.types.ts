// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export interface SubscribeNewsletterDto {
  email: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface UpdateSubscriberDto {
  is_active?: boolean;
}

export interface NewsletterFilters {
  is_active?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}
