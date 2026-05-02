// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { WishlistApiClient } from "./wishlist-client";

export const wishlistApi = new WishlistApiClient();
export { WishlistApiClient };

export type {
  WishlistProperty,
  AddWishlistItemDto,
  WishlistFilters,
} from "../../types/wishlist.types";
