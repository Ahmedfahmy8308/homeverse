<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $table = 'blog_posts';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'tags',
        'image_url',
        'author_id',
        'author_name',
        'author_avatar',
        'read_time',
        'is_published',
        'published_at',
        'views_count',
    ];

    protected $casts = [
        'title' => 'array',
        'excerpt' => 'array',
        'content' => 'array',
        'category' => 'array',
        'tags' => 'array',
        'author_name' => 'array',
        'is_published' => 'boolean',
        'views_count' => 'integer',
    ];
}
