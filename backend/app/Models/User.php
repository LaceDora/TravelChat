<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

   protected $fillable = [
    'name',
    'email',
    'password',
    'phone',
    'gender',
    'date_of_birth',
    'passport_number',
    'country_id',
    'role',
    'avatar_url',
];

protected $hidden = [
    'password',
    'remember_token',
];

protected $casts = [
    'password' => 'hashed',
    'date_of_birth' => 'date',
    'favorite_location_ids' => 'array',
];


    // ================= RELATIONS =================

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function markers()
    {
        return $this->hasMany(UserMarker::class);
    }
}
