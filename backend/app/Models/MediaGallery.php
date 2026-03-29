<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaGallery extends Model
{
    protected $table = 'media_gallery';

    public $timestamps = false; 
    // vì bảng chỉ có created_at, KHÔNG có updated_at

    protected $fillable = [
        'target_type',
        'target_id',
        'image_path',
        'is_primary',
        'created_at',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'created_at' => 'datetime',
    ];
}
