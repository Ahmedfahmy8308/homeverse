// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export type {
  Property,
  PropertyImage,
  PropertyAmenity,
  PropertyAgent,
  PropertyCategory,
  PropertyFilters,
  CreatePropertyDto,
  UpdatePropertyDto,
} from "./properties.types";

export type {
  BlogPost,
  BlogFilters,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from "./blog.types";

export type {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
} from "./auth.types";

export type {
  ApiResponse,
  RequestOptions,
  ApiError,
  LocalizedValue,
} from "./shared.types";

export type {
  SiteSettings,
  AdminDashboardStats,
  AdminBlogPostSummary,
  AdminUserSummary,
} from "./admin.types";

export type {
  ContactMessageDto,
  ContactMessage,
  UpdateContactMessageDto,
  ContactFilters,
} from "./contact.types";

export type {
  Role,
  User,
  AdminUser,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
} from "./users.types";

export type {
  WishlistProperty,
  AddWishlistItemDto,
  UpdateWishlistItemDto,
  WishlistFilters,
} from "./wishlist.types";

export type {
  SubscribeNewsletterDto,
  NewsletterSubscriber,
  UpdateSubscriberDto,
  NewsletterFilters,
} from "./newsletter.types";
