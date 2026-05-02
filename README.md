<!--
  Copyright (c) 2025-2026 Ahmed Fahmy
  Developed at UFUQ TECH
  Proprietary software. See LICENSE file in the project root for full license information.
-->

<div align="center">
  <img src="./Front/public/images/branding/homeverse-logo-dark.png" alt="Homeverse logo" width="300" />
  <h1>Homeverse</h1>
  <p><strong>A full-stack real estate marketplace — Next.js frontend and Laravel API backend.</strong></p>
</div>

---

## Overview

Homeverse is a production-ready real-estate platform combining a modern Next.js 15 frontend and a Laravel 11 REST API. It includes site content, property listing features, a small admin surface, and importable canonical SQL schema and seeds.

Key capabilities:
- Property listings, images and categories
- Agent profiles and contact messaging
- Blog posts and reviews
- Site settings and newsletter subscription

---

## Top-level folders (brief)

- `Api/`: Laravel 11 backend. See [Api/README.md](Api/README.md) for setup, migrations, and API docs.
- `Front/`: Next.js 15 frontend (TypeScript + Tailwind). See [Front/README.md](Front/README.md) for dev and deployment.
- `Documentation/`: design diagrams, architecture diagrams and markdown project book.
- `sql/`: canonical `schema.sql` and `seed.sql` used by the API migration/seed flow.
- `Script/`: helper scripts for local environment (`setup.ps1`, `START.bat`, `STOP.bat`).
- `LICENSE`: project license.

---

## Quick start

1. Backend (API)

```bash
cd Api
composer install
cp .env.example .env
# edit .env DB settings
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
```

2. Frontend (Next.js)

```bash
cd Front
npm install
cp .env.example .env
# set NEXT_PUBLIC_API_URL if needed
npm run dev
```

Notes:
- The frontend expects `NEXT_PUBLIC_API_URL` to point at the API (e.g. `http://127.0.0.1:8000/api`). The app also detects Vercel (via `process.env.VERCEL`) and will point to the production API when deployed; you can explicitly set `NEXT_PUBLIC_API_URL` in Vercel project settings.
- API docs are available at `public/openapi.yaml` (viewable in the browser or imported into Postman/Swagger UI).

---

## Tech stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Laravel 11 (PHP 8.2+), Eloquent ORM
- Database: MySQL 8

---

## Contributing & support

If you'd like help running the project locally (migrations, seeds, or running tests), tell me which OS and I can run commands or create scripts to automate the common steps.

---

## License

&copy; 2026 Ufuq Tech — see `LICENSE` at project root.
