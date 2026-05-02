<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;

class HealthController extends BaseApiController
{
    public function index(): JsonResponse
    {
        return $this->success([
            'time' => gmdate('c'),
            'version' => '11-laravel',
        ], 'Homeverse API is running.');
    }
}
