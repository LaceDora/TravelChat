<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'rating',
        'reviews_count',
        'rating_text',
        'min_price',
        'max_price',
        'discount_percent',
        'is_promotion',
        'promotion_end',
        'description',
        'menu',
        'amenities',
        'image_url',
        'address',
        'lat',
        'lng',
    ];

    protected $casts = [
        'menu' => 'array',
        'amenities' => 'array',
        'is_promotion' => 'boolean',
        'promotion_end' => 'datetime',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function tables()
    {
        return $this->hasMany(RestaurantTable::class);
    }
}