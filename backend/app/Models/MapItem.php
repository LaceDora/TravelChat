<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MapItem extends Model
{
    protected $fillable = [
        'title',
        'type',
        'description',
        'lat',
        'lng',
        'image',
        'ref_id',
        'ref_table'
    ];
}
