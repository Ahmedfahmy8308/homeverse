// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { UsersApiClient } from "./users-client";

export const usersApi = new UsersApiClient();
export { UsersApiClient };

export type {
  Role,
  User,
  AdminUser,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
} from "../../types/users.types";
