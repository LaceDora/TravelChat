<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Explore extends Model
{
    protected $fillable = [
        'category_id',
        'country_id',
        'title',
        'description',
        'image_url',
        'tags'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
