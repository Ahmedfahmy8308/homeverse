// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

/* ─── Contact API Types ─── */

export interface ContactMessageDto {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: number;
  agent_id?: number;
}

export interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UpdateContactMessageDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  is_read?: boolean;
}

export interface ContactFilters {
  unread?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}
