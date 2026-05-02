// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { AdminApiClient } from "./admin-client";

export const adminApi = new AdminApiClient();
export { AdminApiClient };

export type {
  AdminDashboardStats,
  SiteSettings,
  AdminBlogPostSummary,
  AdminUserSummary,
} from "../../types/admin.types";
