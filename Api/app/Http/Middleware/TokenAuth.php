<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if ($token) {
            if (function_exists('repo_find_user_by_token')) {
                $user = repo_find_user_by_token($token);
                if ($user) {
                    // Log the user in for the request lifecycle
                    Auth::loginUsingId((int) $user['id']);
                }
            }
        }

        return $next($request);
    }
}
