// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

import { ContactApiClient } from "./contact-client";

export const contactApi = new ContactApiClient();
export { ContactApiClient };

export type {
  ContactMessage,
  ContactMessageDto,
  UpdateContactMessageDto,
  ContactFilters,
} from "../../types/contact.types";
