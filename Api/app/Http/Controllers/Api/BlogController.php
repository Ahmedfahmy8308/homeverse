<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $filters = [];
        foreach (['limit', 'category', 'all'] as $key) {
            if ($request->has($key)) {
                $filters[$key] = $request->query($key);
            }
        }

        $posts = array_map(
            fn (array $post): array => $this->transformBlogPost($post),
            repo_list_blog_posts($filters)
        );

        return $this->success($posts);
    }

    public function show(int $id): JsonResponse
    {
        $post = repo_get_blog_post($id);
        if ($post === null) {
            return $this->error('Blog post not found.', 404);
        }

        return $this->success($this->transformBlogPost($post));
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $post = repo_get_blog_post_by_slug($slug);
        if ($post === null) {
            return $this->error('Blog post not found.', 404);
        }

        return $this->success($this->transformBlogPost($post));
    }
}
