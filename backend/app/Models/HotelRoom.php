<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelRoom extends Model
{
    use HasFactory;

    protected $table = 'hotel_rooms';

    protected $fillable = [
        'hotel_id',
        'name',
        'price_per_night',
        'discount_percent',
        'capacity',
        'quantity',
        'bed_type',
        'area',
        'dynamic_price',
        'description',
    ];

    protected $casts = [
        'dynamic_price' => 'array',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'hotel_room_id');
    }
}