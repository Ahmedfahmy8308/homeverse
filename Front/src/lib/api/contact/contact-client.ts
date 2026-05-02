// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  ContactMessageDto,
  ContactMessage,
  UpdateContactMessageDto,
  ContactFilters,
} from "../../types/contact.types";

export class ContactApiClient extends BaseApiClient {
  async createMessage(
    data: ContactMessageDto,
  ): Promise<ApiResponse<{ id: number; message: string }>> {
    return this.post("/contact", data);
  }

  async submitContact(
    data: ContactMessageDto,
  ): Promise<ApiResponse<{ id: number; message: string }>> {
    return this.createMessage(data);
  }

  async listMessages(
    filters?: ContactFilters,
  ): Promise<ApiResponse<ContactMessage[]>> {
    this.assertRole(["admin"]);
    const params = new URLSearchParams();
    if (filters?.unread) params.set("unread", "true");
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page !== undefined) params.set("page", String(filters.page));
    if (filters?.per_page !== undefined)
      params.set("per_page", String(filters.per_page));
    const qs = params.toString();
    return this.get<ContactMessage[]>(`/admin/contacts${qs ? `?${qs}` : ""}`);
  }

  async listContacts(
    unreadOnly?: boolean,
  ): Promise<ApiResponse<ContactMessage[]>> {
    return this.listMessages({ unread: unreadOnly });
  }

  async getMessage(id: number): Promise<ApiResponse<ContactMessage>> {
    this.assertRole(["admin"]);
    return this.get<ContactMessage>(`/admin/contacts/${id}`);
  }

  async updateMessage(
    id: number,
    data: UpdateContactMessageDto,
  ): Promise<ApiResponse<ContactMessage>> {
    this.assertRole(["admin"]);
    return this.put<ContactMessage, UpdateContactMessageDto>(
      `/admin/contacts/${id}`,
      data,
    );
  }

  async deleteMessage(id: number): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.delete<void>(`/admin/contacts/${id}`);
  }

  async markMessageRead(id: number): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.put<void>(`/admin/contacts/${id}/read`);
  }

  async markMessageUnread(id: number): Promise<ApiResponse<void>> {
    this.assertRole(["admin"]);
    return this.put<void>(`/admin/contacts/${id}/unread`);
  }

  async markContactRead(id: number): Promise<ApiResponse<void>> {
    return this.markMessageRead(id);
  }
}
