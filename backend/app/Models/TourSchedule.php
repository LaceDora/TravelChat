<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TourSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'day_number',
        'time',
        'title',
        'activity'
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
