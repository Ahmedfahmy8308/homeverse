// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { NewsletterApiClient } from "./newsletter-client";

export const newsletterApi = new NewsletterApiClient();
export { NewsletterApiClient };

export type {
  SubscribeNewsletterDto,
  NewsletterSubscriber,
  UpdateSubscriberDto,
  NewsletterFilters,
} from "../../types/newsletter.types";
