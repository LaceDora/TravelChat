<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'rating',
        'reviews_count',
        'rating_text',
        'price_per_night',
        'discount_percent',
        'is_promotion',
        'promotion_end',
        'combo_content',
        'description',
        'amenities',
        'image_url',
        'address',
        'lat',
        'lng',
    ];

    protected $casts = [
        'amenities' => 'array',
        'is_promotion' => 'boolean',
        'promotion_end' => 'datetime',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function rooms()
    {
        return $this->hasMany(HotelRoom::class);
    }
}