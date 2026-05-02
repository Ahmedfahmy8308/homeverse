<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class GeneralController extends BaseApiController
{
    public function submitContact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['nullable', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
            'subject' => ['nullable', 'string'],
            'message' => ['required', 'string'],
            'property_id' => ['nullable', 'integer'],
            'agent_id' => ['nullable', 'integer'],
        ]);

        try {
            $result = repo_create_contact($data);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($result, 'Message sent.', 201);
    }

    public function subscribeNewsletter(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            $result = repo_subscribe_newsletter((string) $data['email']);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($result, 'Subscribed.');
    }

    public function wishlist(Request $request): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(array_map(fn (array $property): array => $this->transformWishlistProperty($property), repo_get_wishlist((int) $user['id'])));
    }

    public function toggleWishlist(Request $request, int $propertyId): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(repo_toggle_wishlist((int) $user['id'], $propertyId));
    }

    public function siteSettings(): JsonResponse
    {
        return $this->success(repo_get_settings_map());
    }
}
