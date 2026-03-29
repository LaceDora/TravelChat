<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index()
    {
        return response()->json(
            Hotel::with(['location', 'rooms'])->latest()->get()
        );
    }

    public function show($id)
    {
        $hotel = Hotel::with(['location', 'rooms'])->findOrFail($id);
        return response()->json($hotel);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'required|string|max:150',
            'rating' => 'nullable|numeric|min:0|max:10',
            'reviews_count' => 'nullable|integer|min:0',
            'rating_text' => 'nullable|string|max:50',
            'price_per_night' => 'required|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',
            'combo_content' => 'nullable|string',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'image_url' => 'nullable|string',
            'address' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $hotel = Hotel::create($data);

        return response()->json($hotel);
    }

    public function update(Request $request, $id)
    {
        $hotel = Hotel::findOrFail($id);

        $data = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'sometimes|string|max:150',
            'rating' => 'nullable|numeric|min:0|max:10',
            'reviews_count' => 'nullable|integer|min:0',
            'rating_text' => 'nullable|string|max:50',
            'price_per_night' => 'sometimes|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',
            'combo_content' => 'nullable|string',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'image_url' => 'nullable|string',
            'address' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $hotel->update($data);

        return response()->json($hotel);
    }

    public function destroy($id)
    {
        Hotel::destroy($id);

        return response()->json([
            'message' => 'Hotel deleted'
        ]);
    }
}