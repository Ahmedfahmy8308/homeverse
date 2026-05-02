<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $table = 'amenities';

    protected $fillable = ['name', 'slug', 'icon', 'description', 'image_url'];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];
}
