// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

export interface ApiResponse<T> {
  success: boolean;
  isSuccess?: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public response: ApiResponse<unknown>;

  constructor(
    status: number,
    statusText: string,
    response: ApiResponse<unknown>,
    message?: string,
  ) {
    super(message || statusText);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export type LocalizedValue<T> = {
  en: T;
  ar: T;
};
