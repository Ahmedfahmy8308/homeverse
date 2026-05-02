// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

/* ─── Admin API Types ─── */

export interface SiteSettings {
  [key: string]: string;
}

export interface AdminDashboardStats {
  users: number;
  properties: number;
  blog_posts: number;
  agents: number;
  featured_properties: number;
  unread_messages: number;
  reviews: number;
  subscribers: number;
  totalUsers?: number;
  totalProperties?: number;
  totalAgents?: number;
  totalPosts?: number;
  totalFeatured?: number;
  pageViews?: number;
  monthlyRevenue?: number;
  newRegistrations?: number;
  newListings?: number;
  revenueChart?: number[];
}

export interface AdminBlogPostSummary {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  date: string;
}

export interface AdminUserSummary {
  id: number | null;
  name: string;
  email: string;
  role: "User" | "Admin";
  status: "Active" | "Inactive";
  joined?: string;
}
