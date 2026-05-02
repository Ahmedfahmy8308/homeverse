// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import {
  ApiResponse,
  ApiError,
  RequestOptions,
} from "../../types/shared.types";
import { API_CONFIG } from "./config";

interface TokenRefreshHandler {
  refreshToken: () => Promise<boolean>;
  logout: () => void;
}

type UserRole = "admin" | "user";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let globalTokenHandler: TokenRefreshHandler | null = null;

export class BaseApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    if (this.baseUrl.endsWith("/")) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }
    this.defaultHeaders = { "Content-Type": "application/json" };
  }

  static setTokenHandler(handler: TokenRefreshHandler) {
    globalTokenHandler = handler;
  }

  static clearTokenHandler() {
    globalTokenHandler = null;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return null;
      const parsed = JSON.parse(userData);
      return parsed?.token || null;
    } catch {
      return null;
    }
  }

  protected isAuthenticated(): boolean {
    return Boolean(this.getAuthToken());
  }

  protected getCurrentUserRole(): UserRole | null {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return null;
      const parsed = JSON.parse(userData) as { user?: { role?: string } };
      const role = parsed?.user?.role?.toLowerCase();
      if (role === "admin" || role === "user") return role;
      return null;
    } catch {
      return null;
    }
  }

  protected assertAuthenticated(): void {
    if (!this.isAuthenticated()) {
      throw new ApiError(
        401,
        "Unauthorized",
        {
          success: false,
          message: "Authentication required",
          data: null,
          errors: ["Authentication required"],
        },
        "Authentication required",
      );
    }
  }

  protected assertRole(allowedRoles: UserRole[]): void {
    this.assertAuthenticated();
    const role = this.getCurrentUserRole();
    if (!role || !allowedRoles.includes(role)) {
      throw new ApiError(
        403,
        "Forbidden",
        {
          success: false,
          message: "Insufficient role",
          data: null,
          errors: ["Insufficient role"],
        },
        "Insufficient role",
      );
    }
  }

  private prepareHeaders(options?: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    const token = this.getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options?.headers) Object.assign(headers, options.headers);
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let responseData: ApiResponse<T>;

    try {
      const responseText = await response.text();

      if (!responseText.trim()) {
        const isSuccess = response.ok;
        responseData = {
          success: isSuccess,
          message: isSuccess
            ? "Success"
            : response.statusText || `HTTP ${response.status}`,
          data: {} as T,
          errors: isSuccess
            ? []
            : [response.statusText || `HTTP ${response.status}`],
        };
      } else {
        try {
          const parsed: unknown = JSON.parse(responseText);
          const isApiResponseLike = (obj: unknown): obj is ApiResponse<T> => {
            if (!obj || typeof obj !== "object") return false;
            const o = obj as Record<string, unknown>;
            return "data" in o || "success" in o || "isSuccess" in o;
          };

          if (isApiResponseLike(parsed)) {
            const raw = parsed as unknown as Record<string, unknown>;
            const successFlag =
              typeof raw.success === "boolean" ? raw.success : undefined;
            const isSuccessFlag =
              typeof raw.isSuccess === "boolean" ? raw.isSuccess : undefined;
            const normalizedSuccess =
              successFlag ?? isSuccessFlag ?? response.ok;

            responseData = {
              success: normalizedSuccess,
              message:
                typeof raw.message === "string"
                  ? raw.message
                  : normalizedSuccess
                    ? "OK"
                    : "",
              data: (raw.data as T) ?? (parsed as T),
              errors: Array.isArray(raw.errors) ? (raw.errors as string[]) : [],
            };
          } else {
            responseData = {
              success: response.ok,
              message: response.ok ? "OK" : "Request failed",
              data: parsed as T,
              errors: [],
            };
          }
        } catch {
          responseData = {
            success: false,
            message:
              responseText.length > 100
                ? "Invalid response format"
                : responseText || response.statusText,
            data: {} as T,
            errors: [
              responseText.length > 100
                ? "Invalid response format"
                : responseText || response.statusText,
            ],
          };
        }
      }
    } catch {
      responseData = {
        success: false,
        message: response.statusText || "Unknown error",
        data: {} as T,
        errors: [response.statusText || "Unknown error"],
      };
    }

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0] ||
        responseData.message ||
        `HTTP ${response.status}`;
      throw new ApiError(
        response.status,
        response.statusText,
        responseData,
        errorMessage,
      );
    }

    return responseData;
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.prepareHeaders(options);
    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async post<T, R = unknown>(
    endpoint: string,
    data?: R,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.prepareHeaders(options);

    let body: string | FormData | undefined;
    if (data instanceof FormData) {
      body = data;
      delete headers["Content-Type"];
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      credentials: "include",
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async put<T, R = unknown>(
    endpoint: string,
    data?: R,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.prepareHeaders(options);

    let body: string | FormData | undefined;
    if (data instanceof FormData) {
      body = data;
      delete headers["Content-Type"];
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
      credentials: "include",
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.prepareHeaders(options);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
      credentials: "include",
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }
}
