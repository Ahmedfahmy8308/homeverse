<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'password_hash', 'avatar', 'role', 'location', 'bio', 'dob', 'is_active',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function tokens()
    {
        return $this->hasMany(ApiToken::class, 'user_id');
    }
}
