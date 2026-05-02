// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { BaseApiClient } from "../shared/base-client";
import type { ApiResponse } from "../../types/shared.types";
import type {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  User,
} from "./index";

export class AuthApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  async login(credentials: LoginDto): Promise<ApiResponse<LoginResponseDto>> {
    return this.post<LoginResponseDto, LoginDto>("/auth/login", credentials);
  }

  async register(data: RegisterDto): Promise<ApiResponse<LoginResponseDto>> {
    return this.post<LoginResponseDto, RegisterDto>("/auth/register", data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>("/auth/logout");
  }

  async me(): Promise<ApiResponse<User>> {
    return this.get<User>("/auth/me");
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponseDto>> {
    return this.post<RefreshTokenResponseDto>("/auth/refresh");
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.post<void>("/auth/forgot-password", { email });
  }
}
