// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

/* ─── Property API Types ─── */
import type { LocalizedValue } from "./index";

export interface PropertyAmenity {
  id: string;
  name: LocalizedValue<string>;
  description: LocalizedValue<string>;
  image: string;
}

export interface PropertyAgent {
  id: string;
  name: LocalizedValue<string>;
  phone: string;
  email: string;
  avatar: string;
  propertiesSold: number;
  rating: number;
}

export interface Property {
  id: number;
  title: LocalizedValue<string>;
  description: LocalizedValue<string>;
  price: number;
  currency: string;
  period: string;
  type: "rent" | "sale";
  category: LocalizedValue<string>;
  location: LocalizedValue<string>;
  city: LocalizedValue<string>;
  address: LocalizedValue<string>;
  beds: number;
  baths: number;
  area: number;
  floors: number;
  yearBuilt: number;
  garage: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: PropertyAmenity[];
  agent: PropertyAgent;
  createdAt: string;
}

export interface PropertyImage {
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
}

export interface PropertyFilters {
  featured?: boolean;
  listing_type?: "rent" | "sale";
  city?: string;
  category_id?: number;
  status?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PropertyCategory {
  id: number;
  name: LocalizedValue<string>;
  slug: string;
  icon: string;
  description: string;
}

export interface CreatePropertyDto {
  title: LocalizedValue<string>;
  description: LocalizedValue<string>;
  city: LocalizedValue<string>;
  address: LocalizedValue<string>;
  location_label?: LocalizedValue<string>;
  price: number;
  currency?: string;
  price_period?: string;
  listing_type: "rent" | "sale";
  category_id?: number;
  agent_id?: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  floors?: number;
  garage?: number;
  year_built?: number;
  is_featured?: boolean;
  status?: string;
  images?: string[];
  image_files?: File[] | Blob[];
  amenity_ids?: number[];
}

export type UpdatePropertyDto = Partial<CreatePropertyDto>;
