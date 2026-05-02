<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PropertyController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $filters = [];
        foreach (['featured', 'listing_type', 'city', 'category_id', 'status', 'min_price', 'max_price', 'search', 'limit', 'offset'] as $key) {
            if ($request->has($key)) {
                $filters[$key] = $request->query($key);
            }
        }

        $properties = array_map(
            fn (array $property): array => $this->transformProperty($property),
            repo_list_properties($filters)
        );

        return $this->success($properties);
    }

    public function show(int $id): JsonResponse
    {
        $property = repo_get_property($id);
        if ($property === null) {
            return $this->error('Property not found.', 404);
        }

        return $this->success($this->transformProperty($property));
    }

    public function reviews(int $id): JsonResponse
    {
        return $this->success(repo_list_reviews($id));
    }

    public function submitReview(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $data = $request->validate([
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string'],
        ]);

        try {
            $review = repo_create_review($id, (int) $user['id'], $data);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($review, 'Review submitted for approval.', 201);
    }

    public function agents(): JsonResponse
    {
        return $this->success(array_map(fn (array $agent): array => $this->transformAgent($agent), repo_list_agents()));
    }

    public function agent(int $id): JsonResponse
    {
        $agent = repo_get_agent($id);
        if ($agent === null) {
            return $this->error('Agent not found.', 404);
        }

        return $this->success($this->transformAgent($agent));
    }

    public function amenities(): JsonResponse
    {
        return $this->success(array_map(fn (array $amenity): array => $this->transformAmenity($amenity), repo_list_amenities()));
    }

    public function categories(): JsonResponse
    {
        return $this->success(repo_list_categories());
    }
}
