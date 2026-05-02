<!--
  Copyright (c) 2025 Ahmed Fahmy
  Developed at UFUQ TECH
  Proprietary software. See LICENSE file in the project root for full license information.
-->

---
title: "Homeverse Project Book - English Edition"
author: "Ahmed Fahmy (Ufuq Tech)"
date: "April 2026"
version: "3.0.0"
toc: true
toc-depth: 4
---

<div align="center">

![Homeverse Logo](../../Front/public/images/branding/homeverse-logo-dark.png)

# Homeverse Project Book

### English Edition

Premium full-stack documentation for the Homeverse real estate platform.

*Prepared by Ahmed Fahmy (Ufuq Tech) - April 2026*

</div>

---

## Table of Contents

- [Chapter 1. Executive Summary](#chapter-1-executive-summary)
- [Chapter 2. Product Goals and User Roles](#chapter-2-product-goals-and-user-roles)
- [Chapter 3. Architecture and System Design](#chapter-3-architecture-and-system-design)
- [Chapter 4. Functional Workflows](#chapter-4-functional-workflows)
- [Chapter 5. Database Model](#chapter-5-database-model)
- [Chapter 6. User Interface Reference](#chapter-6-user-interface-reference)
- [Chapter 7. Code Snapshot Reference](#chapter-7-code-snapshot-reference)
- [Chapter 8. API and Routing Overview](#chapter-8-api-and-routing-overview)
- [Chapter 9. Security, Reliability, and Operational Notes](#chapter-9-security-reliability-and-operational-notes)
- [Chapter 10. Setup and Deployment](#chapter-10-setup-and-deployment)
- [Chapter 11. Conclusion](#chapter-11-conclusion)

---

<a id="chapter-1-executive-summary"></a>

# Chapter 1. Executive Summary

## 1.1 Project Overview
Homeverse is a full-stack real estate platform that combines a premium Next.js frontend with a PHP API backend. The system supports property discovery, listing management, agent operations, content publishing, user engagement, and administrative control in a single cohesive product.

The platform is designed for two realities at once: high-end public browsing and serious back-office operation. Visitors can explore listings, read blog content, contact agents, and compare properties. Registered users can manage wishlists, submit reviews, and track their account activity. Administrators can manage properties, content, messages, and settings.

## 1.2 Product Vision
The vision behind Homeverse is to turn real estate browsing into a clear, elegant, and trustworthy experience. The product emphasizes speed, visual quality, multilingual support, and maintainable code so the platform can scale with business growth.

## 1.3 Business Value
Homeverse provides value through:
- premium property presentation
- SEO-friendly content and pages
- simplified admin workflows
- multilingual support for English and Arabic users
- reusable API-driven architecture

## 1.4 Scope Summary
The project includes:
- a modern frontend in `Front/`
- a Laravel-style API backend in `Api/`
- design and architecture diagrams in `Documentation/Diagrams/`
- UI screenshots in `Documentation/UI/images/`
- code snapshots in `Documentation/CodeSnaps/`

---

<a id="chapter-2-product-goals-and-user-roles"></a>

# Chapter 2. Product Goals and User Roles

## 2.1 Goals
Homeverse is built to make real estate discovery and management easier, faster, and more credible.

## 2.2 User Roles
- Public Visitor: browses properties, blog posts, services, FAQ, and contact forms.
- Registered User: manages profile, saves properties, writes reviews, and tracks activity.
- Agent: manages assigned listings and handles inquiries.
- Administrator: manages all properties, content, users, settings, and statistics.

## 2.3 Feature Areas
- Marketplace and search
- Property detail pages
- Authentication and account management
- Blog and informational pages
- Dashboard and admin portal
- Support and contact workflows

---

<a id="chapter-3-architecture-and-system-design"></a>

# Chapter 3. Architecture and System Design

## 3.1 Layered Architecture
Homeverse uses a layered, API-first architecture. The frontend renders the experience and communicates with the backend through typed requests. The backend handles authentication, validation, business rules, repository logic, and database access.

![System Architecture](../Diagrams/png/architecture_en.png)

## 3.2 Context View
The context model shows Homeverse as the central platform connected to users and external services such as email, maps, payments, and social sharing.

![Context Diagram](../Diagrams/png/context_diagram_en.png)

## 3.3 Technology Stack
- Frontend: Next.js 15, React, TypeScript, Tailwind CSS
- Backend: PHP 8.2 with routing and token middleware
- Database: MySQL 8
- Content and docs: Markdown, PlantUML, UI screenshots, code snapshots

---

<a id="chapter-4-functional-workflows"></a>

# Chapter 4. Functional Workflows

## 4.1 Use Cases
The use case model captures what each role can do inside the platform.

![Use Case Diagram](../Diagrams/png/use_case_en.png)

## 4.2 Property Creation Flow
This activity diagram shows the end-to-end workflow for adding a property from the admin interface to database persistence.

![Activity Diagram](../Diagrams/png/activity_diagram_en.png)

## 4.3 Wishlist Interaction Flow
This sequence diagram explains the interaction between user, frontend, API, and database when saving a property to the wishlist.

![Sequence Diagram](../Diagrams/png/sequence_diagram_en.png)

---

<a id="chapter-5-database-model"></a>

# Chapter 5. Database Model

## 5.1 Entity Relationship Overview
The ERD is the structural core of the platform. It defines users, agents, properties, images, amenities, reviews, blog posts, wishlists, contact messages, tokens, and settings.

![Database ERD](../Diagrams/png/erd_en.png)

## 5.2 Main Tables
- users: application accounts and roles
- api_tokens: bearer token authentication
- agents: agent profiles and ownership data
- properties: listings and core property attributes
- property_images: gallery images per property
- amenities: reusable feature tags
- property_amenities: many-to-many property feature mapping
- reviews: user feedback for listings
- wishlists: saved properties per user
- contact_messages: inbound inquiries
- blog_posts: content publishing
- newsletter_subscribers: marketing opt-ins
- site_settings: global configuration values

## 5.3 Data Design Notes
The database design is intentionally normalized for the operational entities while preserving flexibility for content-heavy areas such as blog posts and media. This supports both transactional consistency and content growth.

---

<a id="chapter-6-user-interface-reference"></a>

# Chapter 6. User Interface Reference

## 6.1 UI Design Principles
The interface is intentionally premium and editorial. It uses dark surfaces, warm accents, strong image treatment, soft motion, and mobile-first behavior to make the product feel polished and modern.

## 6.2 Public Homepage
Desktop and mobile variants of the landing page.

![Home Page](../UI/images/homeverse_home.png)

![Home Page Mobile](../UI/images/homeverse_home_mobile.png)

## 6.3 Marketplace and Search
The listing experience with filters, cards, and mobile navigation.

![Marketplace](../UI/images/properties_marketplace.png)

![Marketplace Mobile](../UI/images/marketplace_mobile.png)

## 6.4 Property Details
The detail page combines gallery, metrics, agent panel, and amenities.

![Property Detail View](../UI/images/property_detail_view.png)

## 6.5 Blog Experience
Editorial content pages designed to support SEO and long-form reading.

![Blog List](../UI/images/blog.png)

![Blog Post Details](../UI/images/blog_post_details.png)

## 6.6 Services and Information Pages
Supporting pages for trust, policy, and customer education.

![Services Page](../UI/images/services.png)

![About Page](../UI/images/about_us.png)

![Contact Page](../UI/images/contact_us.png)

![FAQ Page](../UI/images/faq.png)

![Terms and Conditions](../UI/images/terms_of_service.png)

## 6.7 Authentication Screens
Sign-in and registration screens used in the user flow.

![Login Screen](../UI/images/login.png)

![Register Screen](../UI/images/register.png)

## 6.8 User and Admin Dashboards
Operational dashboards for regular users and administrators.

![User Dashboard](../UI/images/user_dashboard.png)

![User Dashboard Mobile](../UI/images/user_dashboard_mobile.png)

![Admin Dashboard](../UI/images/admin_dashboard.png)

## 6.9 UI Coverage Map
The screenshots above cover the major customer-facing and admin-facing experiences: discovery, content, account management, trust pages, and control panels.

---

<a id="chapter-7-code-snapshot-reference"></a>

# Chapter 7. Code Snapshot Reference

## 7.1 Frontend Code Evidence
These snapshots document the implementation of key frontend concerns such as the header, hero section, locale switching, and client-side structure.

![Front Header](../CodeSnaps/Front_Header.png)

![Front Hero](../CodeSnaps/Front_Hero.png)

![Language Switcher](../CodeSnaps/Language_Switcher.png)

## 7.2 Backend and API Evidence
These snapshots show the backend routing, token middleware, and application bootstrap logic.

![App PHP](../CodeSnaps/APP.PHP.png)

![Token Auth](../CodeSnaps/Token_Auth.png)

![All API Endpoints Identification](../CodeSnaps/All_API_Endpoints_Identification.png)

## 7.3 Database and Schema Evidence
The schema snapshots show the SQL structure that supports the platform’s entities and relations.

![SQL Schema 1](../CodeSnaps/SQL_Schema_1.png)

![SQL Schema 2](../CodeSnaps/SQL_Schema_2.png)

## 7.4 Code Snapshot Notes
The code images are provided as proof of implementation quality and architectural consistency. They are especially useful for technical review, handover, and documentation traceability.

---

<a id="chapter-8-api-and-routing-overview"></a>

# Chapter 8. API and Routing Overview

## 8.1 API Surface
The backend exposes routes for authentication, properties, agents, amenities, blog posts, contact forms, wishlists, and site settings.

## 8.2 Route Design
The route layout is optimized for clear separation between public access, authenticated user features, and admin-only operations.

## 8.3 Request Flow
Requests typically follow this path:
1. frontend page or component triggers a fetch call
2. backend router receives the request
3. middleware validates token or request constraints
4. repository or controller executes the business rule
5. database returns persisted or queried data
6. frontend renders the result or falls back to safe UI states

---

<a id="chapter-9-security-reliability-and-operational-notes"></a>

# Chapter 9. Security, Reliability, and Operational Notes

## 9.1 Authentication
Homeverse uses token-based authentication for protected actions.

## 9.2 Validation and Sanitization
Incoming requests are validated before persistence, and input is sanitized to reduce the chance of malformed or unsafe data.

## 9.3 Reliability
The frontend is designed to keep the application usable even when the API is temporarily unavailable, with controlled fallback behavior and clear error handling.

## 9.4 Production Readiness
The platform is intended to run with separate frontend and API deployments, proper environment variables, and secure infrastructure configuration.

---

<a id="chapter-10-setup-and-deployment"></a>

# Chapter 10. Setup and Deployment

## 10.1 Local Development
Frontend:
```bash
cd Front
npm install
npm run dev
```

Backend:
```bash
cd Api
composer install
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
```

## 10.2 Production Deployment
- Set `NEXT_PUBLIC_API_URL` to the production API host.
- Configure CORS to allow the deployed frontend domain.
- Cache config and routes for the PHP backend.
- Deploy the frontend and backend separately if required by hosting.

## 10.3 File Inventory
- Diagrams: `Documentation/Diagrams/png/`
- UI screenshots: `Documentation/UI/images/`
- Code snapshots: `Documentation/CodeSnaps/`

---

<a id="chapter-11-conclusion"></a>

# Chapter 11. Conclusion
Homeverse is documented as a complete product system rather than a loose set of screens or endpoints. The architecture, diagrams, UI evidence, code snapshots, and deployment notes are all meant to support a real production lifecycle: design, build, review, deploy, and maintain.
