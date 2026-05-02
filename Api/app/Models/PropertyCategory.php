<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyCategory extends Model
{
    protected $table = 'property_categories';

    protected $fillable = ['name','slug','icon','description','sort_order'];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];
}
