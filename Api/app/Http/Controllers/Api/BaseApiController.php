<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

abstract class BaseApiController extends Controller
{
    protected function success(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error(string $message, int $status = 400, mixed $data = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($data !== null) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $status);
    }

    protected function currentUser(Request $request): ?array
    {
        $token = $request->bearerToken();
        if (!$token || !function_exists('repo_find_user_by_token')) {
            return null;
        }

        $user = repo_find_user_by_token($token);
        return $user ? repo_sanitize_user($user) : null;
    }

    protected function requireAuth(Request $request): array|JsonResponse
    {
        $user = $this->currentUser($request);
        if ($user === null) {
            return $this->error('Unauthorized.', 401);
        }

        return $user;
    }

    protected function requireAdmin(Request $request): array|JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        if (($user['role'] ?? 'user') !== 'admin') {
            return $this->error('Admin access required.', 403);
        }

        return $user;
    }

    protected function categoryName(?int $categoryId): string
    {
        if ($categoryId === null || !function_exists('repo_list_categories')) {
            return '';
        }

        foreach (repo_list_categories() as $category) {
            if ((int) ($category['id'] ?? 0) === $categoryId) {
                return (string) ($category['name'] ?? '');
            }
        }

        return '';
    }

    protected function assetUrl(?string $path): string
    {
        if (empty($path)) return '';
        if (str_starts_with((string)$path, 'http')) return (string)$path;
        return Storage::url((string)$path);
    }

    protected function localizedValue(mixed $value, string $fallback = ''): array
    {
        if (is_array($value)) {
            return [
                'en' => (string) ($value['en'] ?? $fallback),
                'ar' => (string) ($value['ar'] ?? ($value['en'] ?? $fallback)),
            ];
        }

        $text = (string) $value;
        if ($text === '') {
            $text = $fallback;
        }

        return ['en' => $text, 'ar' => $text];
    }

    protected function transformAgent(array $agent): array
    {
        return [
            'id' => 'a' . (int) ($agent['id'] ?? 0),
            'name' => $this->localizedValue($agent['name'] ?? ''),
            'phone' => (string) ($agent['phone'] ?? ''),
            'email' => (string) ($agent['email'] ?? ''),
            'avatar' => $this->assetUrl((string) ($agent['avatar'] ?? '')),
            'propertiesSold' => (int) ($agent['properties_sold'] ?? 0),
            'rating' => (float) ($agent['rating'] ?? 0),
            'translations' => [
                'en' => ['name' => $this->localizedValue($agent['name'] ?? '')['en']],
                'ar' => ['name' => $this->localizedValue($agent['name'] ?? '')['ar']],
            ],
        ];
    }

    protected function transformAmenity(array $amenity): array
    {
        return [
            'id' => 'am' . (int) ($amenity['id'] ?? 0),
            'name' => $this->localizedValue($amenity['name'] ?? ''),
            'description' => $this->localizedValue($amenity['description'] ?? ''),
            'image' => $this->assetUrl((string) ($amenity['image_url'] ?? '')),
            'translations' => [
                'en' => [
                    'name' => $this->localizedValue($amenity['name'] ?? '')['en'],
                    'description' => $this->localizedValue($amenity['description'] ?? '')['en'],
                ],
                'ar' => [
                    'name' => $this->localizedValue($amenity['name'] ?? '')['ar'],
                    'description' => $this->localizedValue($amenity['description'] ?? '')['ar'],
                ],
            ],
        ];
    }

    protected function categoryLocalized(?int $categoryId): array
    {
        if ($categoryId === null || !function_exists('repo_list_categories')) {
            return ['en' => '', 'ar' => ''];
        }

        foreach (repo_list_categories() as $category) {
            if ((int) ($category['id'] ?? 0) === $categoryId) {
                return $this->localizedValue($category['name'] ?? '', '');
            }
        }

        return ['en' => '', 'ar' => ''];
    }

    protected function transformProperty(array $property): array
    {
        $images = array_map(
            static fn (array $image): string => (string) ($image['image_url'] ?? ''),
            $property['images'] ?? []
        );
        // convert to public URLs
        $images = array_map(fn(string $p): string => $this->assetUrl($p), $images);

        $amenities = array_map(
            fn (array $amenity): array => $this->transformAmenity($amenity),
            $property['amenities'] ?? []
        );

        $agent = is_array($property['agent'] ?? null) ? $this->transformAgent($property['agent']) : [
            'id' => 'a0',
            'name' => ['en' => '', 'ar' => ''],
            'phone' => '',
            'email' => '',
            'avatar' => '',
            'propertiesSold' => 0,
            'rating' => 0,
            'translations' => ['en' => ['name' => ''], 'ar' => ['name' => '']],
        ];

        $reviews = function_exists('repo_list_reviews') ? repo_list_reviews((int) ($property['id'] ?? 0)) : [];
        $reviewCount = count($reviews);
        $rating = $reviewCount > 0
            ? round(array_sum(array_map(static fn (array $review): float => (float) ($review['rating'] ?? 0), $reviews)) / $reviewCount, 1)
            : 0.0;

        return [
            'id' => (int) ($property['id'] ?? 0),
            'title' => $this->localizedValue($property['title'] ?? ''),
            'description' => $this->localizedValue($property['description'] ?? ''),
            'translations' => [
                'en' => [
                    'title' => $this->localizedValue($property['title'] ?? '')['en'],
                    'description' => $this->localizedValue($property['description'] ?? '')['en'],
                    'address' => $this->localizedValue($property['address'] ?? '')['en'],
                    'city' => $this->localizedValue($property['city'] ?? '')['en'],
                    'category' => $this->categoryLocalized(isset($property['category_id']) ? (int) $property['category_id'] : null)['en'],
                    'location' => $this->localizedValue($property['location_label'] ?? '')['en'],
                ],
                'ar' => [
                    'title' => $this->localizedValue($property['title'] ?? '')['ar'],
                    'description' => $this->localizedValue($property['description'] ?? '')['ar'],
                    'address' => $this->localizedValue($property['address'] ?? '')['ar'],
                    'city' => $this->localizedValue($property['city'] ?? '')['ar'],
                    'category' => $this->categoryLocalized(isset($property['category_id']) ? (int) $property['category_id'] : null)['ar'],
                    'location' => $this->localizedValue($property['location_label'] ?? '')['ar'],
                ],
            ],
            'price' => (float) ($property['price'] ?? 0),
            'currency' => (string) ($property['currency'] ?? 'EGP'),
            'period' => (string) ($property['price_period'] ?? ''),
            'type' => (string) ($property['listing_type'] ?? 'rent'),
            'category' => $this->categoryLocalized(isset($property['category_id']) ? (int) $property['category_id'] : null),
            'location' => $this->localizedValue($property['location_label'] ?? ''),
            'city' => $this->localizedValue($property['city'] ?? ''),
            'address' => $this->localizedValue($property['address'] ?? ''),
            'beds' => (int) ($property['bedrooms'] ?? 0),
            'baths' => (int) ($property['bathrooms'] ?? 0),
            'area' => (int) ($property['area_sqft'] ?? 0),
            'floors' => (int) ($property['floors'] ?? 1),
            'yearBuilt' => (int) ($property['year_built'] ?? 0),
            'garage' => (int) ($property['garage'] ?? 0),
            'featured' => (bool) ($property['is_featured'] ?? false),
            'rating' => $rating,
            'reviewCount' => $reviewCount,
            'images' => $images,
            'amenities' => $amenities,
            'agent' => $agent,
            'createdAt' => (string) ($property['created_at'] ?? ''),
        ];
    }

    protected function transformWishlistProperty(array $property): array
    {
        return [
            'id' => (int) ($property['id'] ?? 0),
            'title' => $this->localizedValue($property['title'] ?? ''),
            'description' => $this->localizedValue($property['description'] ?? ''),
            'city' => $this->localizedValue($property['city'] ?? ''),
            'address' => $this->localizedValue($property['address'] ?? ''),
            'location_label' => $this->localizedValue($property['location_label'] ?? ''),
            'price' => (float) ($property['price'] ?? 0),
            'currency' => (string) ($property['currency'] ?? 'EGP'),
            'price_period' => (string) ($property['price_period'] ?? ''),
            'listing_type' => (string) ($property['listing_type'] ?? 'rent'),
            'bedrooms' => (int) ($property['bedrooms'] ?? 0),
            'bathrooms' => (int) ($property['bathrooms'] ?? 0),
            'area_sqft' => (int) ($property['area_sqft'] ?? 0),
            'is_featured' => (bool) ($property['is_featured'] ?? false),
            'images' => array_map(fn($img) => $this->assetUrl((string) ($img['image_url'] ?? '')), $property['images'] ?? []),
        ];
    }

    protected function transformBlogPost(array $post): array
    {
        $title = $post['title'] ?? ['en' => '', 'ar' => ''];
        $excerpt = $post['excerpt'] ?? ['en' => '', 'ar' => ''];
        $content = $post['content'] ?? ['en' => '', 'ar' => ''];
        $category = $post['category'] ?? ['en' => 'General', 'ar' => 'عام'];
        $authorName = $post['author_name'] ?? ['en' => 'Admin', 'ar' => 'مدير'];
        $tags = $post['tags'] ?? ['en' => [], 'ar' => []];

        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => is_array($title) ? $title : ['en' => (string) $title, 'ar' => (string) $title],
            'excerpt' => is_array($excerpt) ? $excerpt : ['en' => (string) $excerpt, 'ar' => (string) $excerpt],
            'content' => is_array($content) ? $content : ['en' => (string) $content, 'ar' => (string) $content],
            'category' => is_array($category) ? $category : ['en' => (string) $category, 'ar' => (string) $category],
            'author' => is_array($authorName) ? $authorName : ['en' => (string) $authorName, 'ar' => (string) $authorName],
            'authorAvatar' => $this->assetUrl((string) ($post['author_avatar'] ?? '')),
            'date' => (string) ($post['published_at'] ?? $post['created_at'] ?? ''),
            'readTime' => (string) ($post['read_time'] ?? '5 min'),
            'image' => $this->assetUrl((string) ($post['image_url'] ?? '')),
            'tags' => is_array($tags) ? $tags : ['en' => [], 'ar' => []],
        ];
    }

    protected function transformAdminBlogSummary(array $post): array
    {
        return [
            'id' => (int) ($post['id'] ?? 0),
            'title' => is_array($post['title'] ?? null)
                ? $post['title']
                : ['en' => (string) ($post['title'] ?? ''), 'ar' => (string) ($post['title'] ?? '')],
            'category' => is_array($post['category'] ?? null)
                ? $post['category']
                : ['en' => (string) ($post['category'] ?? 'General'), 'ar' => (string) ($post['category'] ?? 'General')],
            'date' => (string) ($post['published_at'] ?? $post['created_at'] ?? ''),
        ];
    }
}
