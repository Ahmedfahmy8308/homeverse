// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  AdminDashboardStats,
  SiteSettings,
} from "../../types/admin.types";

export class AdminApiClient extends BaseApiClient {
  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardStats>> {
    this.assertRole(["admin"]);
    return this.get<AdminDashboardStats>("/admin/dashboard");
  }

  async getSiteSettings(): Promise<ApiResponse<SiteSettings>> {
    this.assertRole(["admin"]);
    return this.get<SiteSettings>("/admin/site-settings");
  }

  async createSiteSettings(
    settings: Record<string, string>,
  ): Promise<ApiResponse<SiteSettings>> {
    this.assertRole(["admin"]);
    return this.post<SiteSettings>("/admin/site-settings", { settings });
  }

  async updateSiteSettings(
    settings: Record<string, string>,
  ): Promise<ApiResponse<SiteSettings>> {
    this.assertRole(["admin"]);
    return this.put<SiteSettings>("/admin/site-settings", { settings });
  }

  async patchSiteSettings(
    settings: Record<string, string>,
  ): Promise<ApiResponse<SiteSettings>> {
    this.assertRole(["admin"]);
    return this.post<SiteSettings>("/admin/site-settings", { settings });
  }

  async deleteSiteSetting(key: string): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.delete<void>(`/admin/site-settings/${key}`);
  }
}
