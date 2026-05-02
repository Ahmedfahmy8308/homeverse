<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agents';

    protected $fillable = ['user_id', 'name', 'email', 'phone', 'avatar', 'bio', 'speciality', 'properties_sold', 'rating', 'is_active'];

    protected $casts = [
        'name' => 'array',
    ];
}
