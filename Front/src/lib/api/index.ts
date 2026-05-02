// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

/**
 * Central API instances — import these singletons throughout the app
 * instead of creating new client instances each time.
 */

import { AdminApiClient } from "./admin";
import { AuthApiClient } from "./auth";
import { PropertiesApiClient } from "./properties";
import { BlogApiClient } from "./blog";
import { contactApi } from "./contact";
import { usersApi } from "./users";
import { newsletterApi } from "./newsletter";
import { wishlistApi } from "./wishlist";
import type {
  ContactMessageDto,
  UpdateContactMessageDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateSubscriberDto,
  UpdateWishlistItemDto,
} from "../types";

export const adminApi = new AdminApiClient();
export const authApi = new AuthApiClient();
export const propertiesApi = new PropertiesApiClient();
export const blogApi = new BlogApiClient();
export { contactApi, usersApi, newsletterApi, wishlistApi };

export const generalApi = {
  // admin
  getAdminDashboard: () => adminApi.getAdminDashboard(),
  getSiteSettings: () => adminApi.getSiteSettings(),
  createSiteSettings: (settings: Record<string, string>) =>
    adminApi.createSiteSettings(settings),
  updateSiteSettings: (settings: Record<string, string>) =>
    adminApi.updateSiteSettings(settings),
  patchSiteSettings: (settings: Record<string, string>) =>
    adminApi.patchSiteSettings(settings),
  deleteSiteSetting: (key: string) => adminApi.deleteSiteSetting(key),
  // users
  getProfile: () => usersApi.getProfile(),
  updateProfile: (data: UpdateUserDto) => usersApi.updateProfile(data),
  listUsers: () => usersApi.listUsers(),
  getUser: (id: number) => usersApi.getUser(id),
  createUser: (data: CreateUserDto) => usersApi.createUser(data),
  updateUser: (id: number, data: UpdateUserDto) =>
    usersApi.updateUser(id, data),
  deleteUser: (id: number) => usersApi.deleteUser(id),
  // contact
  submitContact: (data: ContactMessageDto) => contactApi.submitContact(data),
  listContacts: (unreadOnly?: boolean) => contactApi.listContacts(unreadOnly),
  getContact: (id: number) => contactApi.getMessage(id),
  createContact: (data: ContactMessageDto) => contactApi.createMessage(data),
  updateContact: (id: number, data: UpdateContactMessageDto) =>
    contactApi.updateMessage(id, data),
  deleteContact: (id: number) => contactApi.deleteMessage(id),
  markContactRead: (id: number) => contactApi.markContactRead(id),
  // newsletter
  subscribeNewsletter: (email: string) =>
    newsletterApi.subscribeNewsletter(email),
  unsubscribeNewsletter: (email: string) =>
    newsletterApi.unsubscribeNewsletter(email),
  listSubscribers: () => newsletterApi.listSubscribers(),
  getSubscriber: (id: number) => newsletterApi.getSubscriber(id),
  updateSubscriber: (id: number, data: UpdateSubscriberDto) =>
    newsletterApi.updateSubscriber(id, data),
  deleteSubscriber: (id: number) => newsletterApi.deleteSubscriber(id),
  // wishlist
  getWishlist: () => wishlistApi.getWishlist(),
  listWishlist: () => wishlistApi.listItems(),
  getWishlistItem: (propertyId: number) => wishlistApi.getItem(propertyId),
  addWishlistItem: (propertyId: number) =>
    wishlistApi.addItem({ property_id: propertyId }),
  updateWishlistItem: (propertyId: number, data: UpdateWishlistItemDto) =>
    wishlistApi.updateItem(propertyId, data),
  deleteWishlistItem: (propertyId: number) =>
    wishlistApi.deleteItem(propertyId),
  clearWishlist: () => wishlistApi.clearWishlist(),
  toggleWishlist: (propertyId: number) =>
    wishlistApi.toggleWishlist(propertyId),
};

// Re-export all clients and types for convenience
export { AuthApiClient } from "./auth";
export { PropertiesApiClient } from "./properties";
export { BlogApiClient } from "./blog";
export { ContactApiClient } from "./contact";
export { UsersApiClient } from "./users";
export { NewsletterApiClient } from "./newsletter";
export { WishlistApiClient } from "./wishlist";
export { AdminApiClient } from "./admin";
export { BaseApiClient, ApiError } from "./shared";
export type { ApiResponse, RequestOptions } from "./shared";
