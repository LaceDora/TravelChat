<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = [
        'country_id',
        'name',
        'description',
        'content',
        'address',
        'province',
        'lat',
        'lng',
        'image_url',
        'views_count',
    ];

    // Quan hệ với country
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    // Quan hệ với hotel
    public function hotels()
    {
        return $this->hasMany(Hotel::class, 'location_id');
    }

    // Quan hệ với restaurant
    public function restaurants()
    {
        return $this->hasMany(Restaurant::class, 'location_id');
    }

    // Quan hệ với tour
    public function tours()
    {
        return $this->hasMany(Tour::class, 'location_id');
    }
}