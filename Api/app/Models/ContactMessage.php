<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    public $timestamps = false;

    protected $fillable = ['first_name','last_name','email','phone','subject','message','property_id','agent_id','is_read','created_at'];
}
