<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'name',
        'slug',
        'days',
        'transport',
        'departure_location',
        'description',
        'content',
        'combo_content',
        'image_url',
        'is_active',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function schedules()
    {
        return $this->hasMany(TourSchedule::class);
    }

    public function departures()
    {
        return $this->hasMany(TourDepartures::class);
    }
}
