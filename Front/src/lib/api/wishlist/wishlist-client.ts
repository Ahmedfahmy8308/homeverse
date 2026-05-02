// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  WishlistProperty,
  AddWishlistItemDto,
  UpdateWishlistItemDto,
  WishlistFilters,
} from "../../types/wishlist.types";

export class WishlistApiClient extends BaseApiClient {
  async listItems(
    filters?: WishlistFilters,
  ): Promise<ApiResponse<WishlistProperty[]>> {
    this.assertAuthenticated();
    const params = new URLSearchParams();
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.per_page !== undefined)
      params.set("per_page", String(filters.per_page));
    const qs = params.toString();
    return this.get<WishlistProperty[]>(`/wishlist${qs ? `?${qs}` : ""}`);
  }

  async getWishlist(): Promise<ApiResponse<WishlistProperty[]>> {
    return this.listItems();
  }

  async getItem(propertyId: number): Promise<ApiResponse<WishlistProperty>> {
    this.assertAuthenticated();
    return this.get<WishlistProperty>(`/wishlist/${propertyId}`);
  }

  async addItem(
    data: AddWishlistItemDto,
  ): Promise<ApiResponse<{ wishlisted: boolean }>> {
    this.assertAuthenticated();
    return this.post<{ wishlisted: boolean }, AddWishlistItemDto>(
      "/wishlist",
      data,
    );
  }

  async updateItem(
    propertyId: number,
    data: UpdateWishlistItemDto,
  ): Promise<ApiResponse<WishlistProperty>> {
    this.assertAuthenticated();
    return this.put<WishlistProperty, UpdateWishlistItemDto>(
      `/wishlist/${propertyId}`,
      data,
    );
  }

  async deleteItem(propertyId: number): Promise<ApiResponse<void>> {
    this.assertAuthenticated();
    return this.delete<void>(`/wishlist/${propertyId}`);
  }

  async clearWishlist(): Promise<ApiResponse<void>> {
    this.assertAuthenticated();
    return this.delete<void>("/wishlist");
  }

  async toggleWishlist(
    propertyId: number,
  ): Promise<ApiResponse<{ wishlisted: boolean }>> {
    this.assertAuthenticated();
    return this.post(`/wishlist/${propertyId}`);
  }
}
