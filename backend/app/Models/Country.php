<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'cover_url'
    ];

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function explores()
    {
        return $this->hasMany(Explore::class);
    }
}
