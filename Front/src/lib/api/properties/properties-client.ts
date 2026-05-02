// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type { LocalizedValue } from "../../types/shared.types";
import type {
  Property,
  PropertyFilters,
  PropertyCategory,
  PropertyAmenity,
  PropertyAgent,
  CreatePropertyDto,
  UpdatePropertyDto,
} from "./index";
import {
  properties,
  agents,
  amenitiesLibrary,
} from "../../mock/properties.mock";

function hasMeaningfulValue(value: unknown): boolean {
  return !(
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

function mergeLocalized<T>(
  value: LocalizedValue<T> | undefined,
  fallback: LocalizedValue<T>,
): LocalizedValue<T> {
  if (!value) return fallback;
  return hasMeaningfulValue(value.en) || hasMeaningfulValue(value.ar)
    ? value
    : fallback;
}

function mergeArray<T>(value: T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function mergeValue<T>(value: T | undefined, fallback: T): T {
  return hasMeaningfulValue(value) ? (value as T) : fallback;
}

function mergeProperty(property: Partial<Property>): Property {
  const fallback = properties.find((item) => item.id === property.id);
  if (!fallback) return property as Property;

  return {
    ...fallback,
    ...property,
    title: mergeLocalized(property.title, fallback.title),
    description: mergeLocalized(property.description, fallback.description),
    category: mergeLocalized(property.category, fallback.category),
    location: mergeLocalized(property.location, fallback.location),
    city: mergeLocalized(property.city, fallback.city),
    address: mergeLocalized(property.address, fallback.address),
    images: mergeArray(property.images, fallback.images),
    amenities: mergeArray(property.amenities, fallback.amenities),
    agent: property.agent
      ? { ...fallback.agent, ...property.agent }
      : fallback.agent,
    currency: mergeValue(property.currency, fallback.currency),
    period: mergeValue(property.period, fallback.period),
    type: mergeValue(property.type, fallback.type),
    price: mergeValue(property.price, fallback.price),
    beds: mergeValue(property.beds, fallback.beds),
    baths: mergeValue(property.baths, fallback.baths),
    area: mergeValue(property.area, fallback.area),
    floors: mergeValue(property.floors, fallback.floors),
    yearBuilt: mergeValue(property.yearBuilt, fallback.yearBuilt),
    garage: mergeValue(property.garage, fallback.garage),
    featured: mergeValue(property.featured, fallback.featured),
    rating: mergeValue(property.rating, fallback.rating),
    reviewCount: mergeValue(property.reviewCount, fallback.reviewCount),
    createdAt: mergeValue(property.createdAt, fallback.createdAt),
  };
}

function mergeById<T extends { id: string | number }>(
  items: T[],
  fallbackItems: T[],
): T[] {
  return items.map((item) => {
    const fallback = fallbackItems.find(
      (candidate) => candidate.id === item.id,
    );
    return fallback ? { ...fallback, ...item } : item;
  });
}

export class PropertiesApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  /** List properties with optional filters */
  async listProperties(
    filters?: PropertyFilters,
  ): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });
    }
    const qs = params.toString();
    const response = await this.get<Property[]>(
      `/properties${qs ? `?${qs}` : ""}`,
    );
    return {
      ...response,
      data: (response.data || []).map((item) => mergeProperty(item)),
    };
  }

  /** Get a single property by ID */
  async getProperty(id: number): Promise<ApiResponse<Property>> {
    const response = await this.get<Property>(`/properties/${id}`);
    return {
      ...response,
      data: mergeProperty(response.data),
    };
  }

  /** Get reviews for a property */
  async getPropertyReviews(propertyId: number): Promise<
    ApiResponse<
      Array<{
        id: number;
        rating: number;
        comment: string;
        user_name: string;
        user_avatar: string;
        created_at: string;
      }>
    >
  > {
    return this.get(`/properties/${propertyId}/reviews`);
  }

  /** Submit a review for a property (authenticated) */
  async submitReview(
    propertyId: number,
    data: { rating: number; comment: string },
  ): Promise<ApiResponse<{ id: number; rating: number; comment: string }>> {
    return this.post(`/properties/${propertyId}/reviews`, data);
  }

  /** List all property categories */
  async listCategories(): Promise<ApiResponse<PropertyCategory[]>> {
    return this.get<PropertyCategory[]>("/categories");
  }

  /** List all amenities */
  async listAmenities(): Promise<ApiResponse<PropertyAmenity[]>> {
    const response = await this.get<PropertyAmenity[]>("/amenities");
    return {
      ...response,
      data: mergeById(
        response.data || [],
        amenitiesLibrary as unknown as PropertyAmenity[],
      ),
    };
  }

  /** List all agents */
  async listAgents(): Promise<ApiResponse<PropertyAgent[]>> {
    const response = await this.get<PropertyAgent[]>("/agents");
    return {
      ...response,
      data: mergeById(
        response.data || [],
        agents as unknown as PropertyAgent[],
      ),
    };
  }

  /** Get a single agent by ID */
  async getAgent(id: number): Promise<ApiResponse<PropertyAgent>> {
    return this.get<PropertyAgent>(`/agents/${id}`);
  }

  // ── Admin endpoints ──

  /** Create a new property (admin) */
  async createProperty(
    data: CreatePropertyDto,
  ): Promise<ApiResponse<Property>> {
    return this.post<Property, CreatePropertyDto>("/admin/properties", data);
  }

  /** Update a property (admin) */
  async updateProperty(
    id: number,
    data: UpdatePropertyDto,
  ): Promise<ApiResponse<Property>> {
    return this.put<Property, UpdatePropertyDto>(
      `/admin/properties/${id}`,
      data,
    );
  }

  /** Delete a property (admin) */
  async deleteProperty(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/properties/${id}`);
  }

  /** List all properties (admin) */
  async listAdminProperties(): Promise<ApiResponse<Property[]>> {
    const response = await this.get<Property[]>("/admin/properties");
    return {
      ...response,
      data: (response.data || []).map((item) => mergeProperty(item)),
    };
  }
}
