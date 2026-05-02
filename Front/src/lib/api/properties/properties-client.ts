// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
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

export class PropertiesApiClient extends BaseApiClient {
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
    return this.withFallback(
      this.get<Property[]>(`/properties${qs ? `?${qs}` : ""}`),
      properties as unknown as Property[],
    );
  }

  /** Get a single property by ID */
  async getProperty(id: number): Promise<ApiResponse<Property>> {
    return this.withFallback(
      this.get<Property>(`/properties/${id}`),
      properties.find((p) => p.id === id) as unknown as Property,
    );
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
    return this.withFallback(
      this.get<PropertyCategory[]>("/categories"),
      [], // Add mock categories if available, or just empty array
    );
  }

  /** List all amenities */
  async listAmenities(): Promise<ApiResponse<PropertyAmenity[]>> {
    return this.withFallback(
      this.get<PropertyAmenity[]>("/amenities"),
      amenitiesLibrary as unknown as PropertyAmenity[],
    );
  }

  /** List all agents */
  async listAgents(): Promise<ApiResponse<PropertyAgent[]>> {
    return this.withFallback(
      this.get<PropertyAgent[]>("/agents"),
      agents as unknown as PropertyAgent[],
    );
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
    return this.withFallback(
      this.get<Property[]>("/admin/properties"),
      properties as unknown as Property[],
    );
  }
}
