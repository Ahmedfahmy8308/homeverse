<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    protected $table = 'property_images';

    public $timestamps = false;

    protected $fillable = ['property_id', 'image_url', 'alt_text', 'sort_order', 'is_primary', 'created_at'];
}
