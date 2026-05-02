// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export type Role = "admin" | "user";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  phone?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  dob?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminUser extends User {
  status?: "Active" | "Inactive";
  joined?: string;
  name?: string;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: Role;
  phone?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  dob?: string | null;
  is_active?: boolean;
}

export interface UserFilters {
  role?: Role;
  is_active?: boolean;
  search?: string;
}
