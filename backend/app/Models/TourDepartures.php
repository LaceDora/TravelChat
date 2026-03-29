<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TourDepartures extends Model
{
	use HasFactory;

	protected $table = 'tour_departures';

	protected $fillable = [
		'tour_id',
		'departure_date',
		'capacity',
		'booked',
		'price',
		'discount_percent',
		'is_promotion',
		'promotion_end',
		'status',
	];

	public function tour()
	{
		return $this->belongsTo(Tour::class);
	}
}
