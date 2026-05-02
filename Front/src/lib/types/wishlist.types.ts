// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import type { LocalizedValue } from "./shared.types";

/* ─── Wishlist API Types ─── */

export interface WishlistProperty {
  id: number;
  title: LocalizedValue<string>;
  description: LocalizedValue<string>;
  city: LocalizedValue<string>;
  address: LocalizedValue<string>;
  location_label: LocalizedValue<string>;
  price: number;
  currency: string;
  price_period: string;
  listing_type: "rent" | "sale";
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  is_featured: boolean;
  images: Array<{
    id: number;
    image_url: string;
    alt_text: string;
    is_primary: boolean;
  }>;
}

export interface AddWishlistItemDto {
  property_id: number;
}

export interface UpdateWishlistItemDto {
  notes?: string;
}

export interface WishlistFilters {
  page?: number;
  per_page?: number;
}
