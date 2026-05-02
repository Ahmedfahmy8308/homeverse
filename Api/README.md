<!--
  Copyright (c) 2025 Ahmed Fahmy
  Developed at UFUQ TECH
  Proprietary software. See LICENSE file in the project root for full license information.
-->

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Homeverse API (Api/)

This directory contains the Laravel 11 REST API that powers the `Front/` frontend.

### Prerequisites

- PHP 8.2+
- Composer
- MySQL 8 (or compatible MariaDB)
- Node.js (for frontend assets / Vite if needed)

### Quick start (local)

```bash
cd Api
composer install
cp .env.example .env
# edit DB_* values in .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
```

API base URL (dev): `http://127.0.0.1:8000`

### Docker (optional)

If you prefer Docker, create a `docker-compose.yml` that provides PHP-FPM, MySQL and an HTTP server, then run migrations from the PHP container. The repository does not include a docker compose file by default.

### Database and seeds

- Canonical SQL: `sql/schema.sql` and `sql/seed.sql`.
- Laravel migrations and seeders wrap these files; see `database/migrations` and `database/seeders/HomeverseDatabaseSeeder.php`.

### Authentication

The API supports a simple token-based flow using the `api_tokens` table. Middleware alias `auth.token` validates Bearer tokens and maps them to users via repository helpers implemented in `app/Support/repo_functions.php`.

### Useful artisan commands

- Run migrations: `php artisan migrate`
- Seed demo data: `php artisan db:seed`
- Run tests: `php artisan test` or `vendor/bin/phpunit`
- List API routes: `php artisan route:list --path=api`

### Files of interest

- `routes/api.php` — API surface consumed by the frontend
- `app/Http/Controllers/Api/` — controllers handling API requests
- `app/Models/` — Eloquent models for domain entities
- `app/Support/repo_functions.php` — compatibility layer used by legacy helpers
- `public/openapi.yaml` — API schema (OpenAPI) for documentation and client generation

### Deploying

- For production, serve with a proper web server (NGINX/Apache) and PHP-FPM. Ensure `APP_ENV=production`, `APP_DEBUG=false`, and strong DB credentials in `.env`.
- Run `php artisan migrate --force` and `php artisan config:cache` during deploy.

---

If you'd like, I can run the migrations and seeds against the DB configured in `Api/.env` now, or prepare a Docker compose example for local development.

