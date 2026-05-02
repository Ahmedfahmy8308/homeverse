<!--
  Copyright (c) 2025 Ahmed Fahmy
  Developed at UFUQ TECH
  Proprietary software. See LICENSE file in the project root for full license information.
-->

# Homeverse Frontend

A high-performance Next.js 15 frontend (TypeScript + Tailwind CSS) for the Homeverse platform.

## Requirements

- Node 18.x (LTS recommended)
- npm or yarn

## Install

```bash
cd Front
npm install
```

## Environment

Copy `.env.example` to `.env` and configure values. Important env vars:

- `NEXT_PUBLIC_API_URL` — base API URL (e.g. `http://127.0.0.1:8000/api`).

Note: The app detects Vercel at runtime (`process.env.VERCEL`) and will automatically use the production API host when deployed. You can still explicitly set `NEXT_PUBLIC_API_URL` in Vercel project settings to override.

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Build & Production

```bash
npm run build
npm run start
```

## Deployment (Vercel)

1. Create a Vercel project from this repository.
2. In Vercel project settings, set the `NEXT_PUBLIC_API_URL` environment variable to `https://api.homeverse.ufuq-tech.com` (or your production API).
3. The app will also detect `VERCEL` at runtime and use the production API endpoint if `NEXT_PUBLIC_API_URL` is not set.

## Project structure highlights

- `src/app/` — Next.js App Router pages and layout groups
- `src/lib/api/` — typed API clients that call the Laravel backend and fall back to local mocks on network errors
- `src/components/` — UI components and design system

## Scripts

- `npm run dev` — dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Troubleshooting

- If API calls fail in dev, ensure the API is running and `NEXT_PUBLIC_API_URL` points to it.
- The frontend will use mocked responses from `src/lib/api` clients if the API is unreachable; check console logs for fallback messages.

## Notes

- Keep `Front/.env` out of version control. Use Vercel environment settings for production.
- See [Api/README.md](../Api/README.md) for backend details.
