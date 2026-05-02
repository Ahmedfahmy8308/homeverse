// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  AdminDashboardStats,
  SiteSettings,
} from "../../types/admin.types";
import { dashboardStats } from "../../mock/dashboard.mock";

export class AdminApiClient extends BaseApiClient {
  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardStats>> {
    this.assertRole(["admin"]);
    const mapped: AdminDashboardStats = {
      users: dashboardStats.totalUsers,
      properties: dashboardStats.totalProperties,
      blog_posts: dashboardStats.totalPosts,
      agents: 0,
      featured_properties: dashboardStats.totalFeatured,
      unread_messages: 0,
      reviews: 0,
      subscribers: 0,
      pageViews: dashboardStats.pageViews,
      monthlyRevenue: dashboardStats.monthlyRevenue,
      newRegistrations: dashboardStats.newRegistrations,
      newListings: dashboardStats.newListings,
      revenueChart: dashboardStats.revenueChart,
    };
    const apiPromise = this.get<AdminDashboardStats>("/admin/dashboard");
    return apiPromise.catch(() => ({
      success: true,
      isSuccess: true,
      message: "Loaded from mock data",
      data: mapped,
    }));
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
