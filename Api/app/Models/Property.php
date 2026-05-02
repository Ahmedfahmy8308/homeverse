<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $table = 'properties';

    protected $fillable = [
        'title','description','city','address','location_label','latitude','longitude','price','currency','price_period','listing_type','category_id','agent_id','bedrooms','bathrooms','area_sqft','floors','garage','year_built','is_featured','status','views_count'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'city' => 'array',
        'address' => 'array',
        'location_label' => 'array',
    ];

    public function images()
    {
        return $this->hasMany(PropertyImage::class, 'property_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities', 'property_id', 'amenity_id');
    }
}
