<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(
            Location::with('country')->get()
        );
    }

    public function show($id)
    {
        $location = Location::with([
            'country',
            'hotels',
            'restaurants',
            'tours'
        ])->findOrFail($id);

        // ✅ tăng lượt xem
        $location->increment('views_count');

        // ✅ gợi ý địa điểm cùng tỉnh (không random bậy)
        $relatedLocations = Location::where('province', $location->province)
            ->where('id', '!=', $location->id)
            ->limit(6)
            ->get();

        return response()->json([
            'id' => $location->id,
            'name' => $location->name,

            'description' => $location->description,
            'content' => $location->content,

            'address' => $location->address,
            'province' => $location->province,

            'lat' => $location->lat,
            'lng' => $location->lng,

            'views_count' => $location->views_count,

            'image_url' => $location->image_url,
            'country' => $location->country,

            // ✅ liên kết
            'hotels' => $location->hotels,
            'restaurants' => $location->restaurants,
            'tours' => $location->tours,

            // ✅ gợi ý địa điểm
            'related_locations' => $relatedLocations,
        ]);
    }
}
