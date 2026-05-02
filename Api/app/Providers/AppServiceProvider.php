<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->runningInConsole()) {
            return;
        }

        // Load our Eloquent-based repo compatibility functions instead of the legacy src/ bridge.
        require_once app_path('Support/repo_functions.php');

        // Register token auth middleware alias so routes can use 'auth.token'.
        if (isset($this->app['router'])) {
            $this->app['router']->aliasMiddleware('auth.token', \App\Http\Middleware\TokenAuth::class);
        }
    }
}
