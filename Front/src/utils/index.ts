// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { clsx, type ClassValue } from "clsx";

// Simple cn function without tailwind-merge (lightweight)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
