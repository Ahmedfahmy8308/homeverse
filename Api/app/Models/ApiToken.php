<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ApiToken extends Model
{
    protected $table = 'api_tokens';
    public $timestamps = false;

    protected $fillable = ['user_id', 'token', 'expires_at', 'created_at'];

    public static function createForUser(User $user): string
    {
        $token = bin2hex(random_bytes(32));
        static::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => null,
            'created_at' => now()->toDateTimeString(),
        ]);

        return $token;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
