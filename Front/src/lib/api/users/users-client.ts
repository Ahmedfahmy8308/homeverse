// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  AdminUser,
  UpdateUserDto,
  CreateUserDto,
  UserFilters,
} from "../../types/users.types";

export class UsersApiClient extends BaseApiClient {
  async getProfile(): Promise<ApiResponse<AdminUser>> {
    this.assertAuthenticated();
    return this.get<AdminUser>("/auth/profile");
  }

  async updateProfile(data: UpdateUserDto): Promise<ApiResponse<AdminUser>> {
    this.assertAuthenticated();
    return this.put<AdminUser, UpdateUserDto>("/auth/profile", data);
  }

  async listUsers(filters?: UserFilters): Promise<ApiResponse<AdminUser[]>> {
    this.assertRole(["admin"]);
    const params = new URLSearchParams();
    if (filters?.role) params.set("role", filters.role);
    if (filters?.is_active !== undefined)
      params.set("is_active", filters.is_active ? "1" : "0");
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    return this.get<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ""}`);
  }

  async getUser(id: number): Promise<ApiResponse<AdminUser>> {
    this.assertRole(["admin"]);
    return this.get<AdminUser>(`/admin/users/${id}`);
  }

  async createUser(data: CreateUserDto): Promise<ApiResponse<AdminUser>> {
    this.assertRole(["admin"]);
    return this.post<AdminUser, CreateUserDto>("/admin/users", data);
  }

  async updateUser(
    id: number,
    data: UpdateUserDto,
  ): Promise<ApiResponse<AdminUser>> {
    this.assertRole(["admin"]);
    return this.put<AdminUser, UpdateUserDto>(`/admin/users/${id}`, data);
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.delete<void>(`/admin/users/${id}`);
  }
}
