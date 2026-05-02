<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AdminController extends BaseApiController
{
    public function dashboard(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $stats = repo_admin_dashboard();
        $stats['pageViews'] = (int) collect(repo_list_properties([]))->sum('views_count');
        $stats['monthlyRevenue'] = 0;
        $stats['newRegistrations'] = 0;
        $stats['newListings'] = 0;
        $stats['revenueChart'] = array_fill(0, 12, 0);

        return $this->success($stats);
    }

    public function users(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(repo_list_users());
    }

    public function deleteUser(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        if (!repo_delete_user($id)) {
            return $this->error('User not found.', 404);
        }

        return $this->success(null, 'User deleted.');
    }

    public function properties(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(array_map(fn (array $property): array => $this->transformProperty($property), repo_list_properties([])));
    }

    public function createProperty(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $property = repo_create_property($request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($this->transformProperty($property), 'Property created.', 201);
    }

    public function updateProperty(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $property = repo_update_property($id, $request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        if ($property === null) {
            return $this->error('Property not found.', 404);
        }

        return $this->success($this->transformProperty($property));
    }

    public function deleteProperty(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        if (!repo_delete_property($id)) {
            return $this->error('Property not found.', 404);
        }

        return $this->success(null, 'Property deleted.');
    }

    public function agents(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(array_map(fn (array $agent): array => $this->transformAgent($agent), repo_list_agents()));
    }

    public function createAgent(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $agent = repo_create_agent($request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($this->transformAgent($agent), 'Agent created.', 201);
    }

    public function updateAgent(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $agent = repo_update_agent($id, $request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        if ($agent === null) {
            return $this->error('Agent not found.', 404);
        }

        return $this->success($this->transformAgent($agent));
    }

    public function deleteAgent(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        if (!repo_delete_agent($id)) {
            return $this->error('Agent not found.', 404);
        }

        return $this->success(null, 'Agent deleted.');
    }

    public function createBlogPost(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $request->validate([
            'title' => ['required'],
            'excerpt' => ['required'],
            'content' => ['required'],
            'category' => ['required'],
            'author_name' => ['required'],
            'tags' => ['required'],
            'image_file' => ['nullable', 'file', 'image', 'max:5120'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        try {
            $post = repo_create_blog_post($request, (int) ($user['id'] ?? 0));
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($this->transformBlogPost($post), 'Blog post created.', 201);
    }

    public function blogPosts(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success(array_map(fn (array $post): array => $this->transformBlogPost($post), repo_list_blog_posts(['all' => true])));
    }

    public function updateBlogPost(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $request->validate([
            'title' => ['sometimes'],
            'excerpt' => ['sometimes'],
            'content' => ['sometimes'],
            'category' => ['sometimes'],
            'author_name' => ['sometimes'],
            'tags' => ['sometimes'],
            'image_file' => ['nullable', 'file', 'image', 'max:5120'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        try {
            $post = repo_update_blog_post($id, $request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        if ($post === null) {
            return $this->error('Blog post not found.', 404);
        }

        return $this->success($this->transformBlogPost($post));
    }

    public function deleteBlogPost(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        if (!repo_delete_blog_post($id)) {
            return $this->error('Blog post not found.', 404);
        }

        return $this->success(null, 'Blog post deleted.');
    }

    public function contacts(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $unreadOnly = filter_var($request->query('unread', false), FILTER_VALIDATE_BOOL);
        return $this->success(repo_list_contacts($unreadOnly));
    }

    public function markContactRead(Request $request, int $id): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        repo_mark_contact_read($id);
        return $this->success(null, 'Marked as read.');
    }

    public function createAmenity(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $amenity = repo_create_amenity($request);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        return $this->success($this->transformAmenity($amenity), 'Amenity created.', 201);
    }

    public function updateSiteSettings(Request $request): JsonResponse
    {
        $user = $this->requireAdmin($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $settings = $request->input('settings', []);
        if (!is_array($settings)) {
            return $this->error('Settings payload must be an object.', 422);
        }

        repo_bulk_upsert_settings($settings);
        return $this->success(repo_get_settings_map(), 'Settings updated.');
    }
}
