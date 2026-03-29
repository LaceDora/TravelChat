<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index()
    {
        return response()->json(
            Restaurant::with(['location', 'tables'])->latest()->get()
        );
    }

    public function show($id)
    {
        $restaurant = Restaurant::with(['location', 'tables'])->find($id);

        if (!$restaurant) {
            return response()->json([
                'message' => 'Restaurant not found'
            ], 404);
        }

        return response()->json($restaurant);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'required|string|max:255',

            'rating' => 'nullable|numeric|min:0|max:10',
            'reviews_count' => 'nullable|integer|min:0',
            'rating_text' => 'nullable|string|max:50',

            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',

            'discount_percent' => 'nullable|integer|min:0|max:100',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',

            'description' => 'nullable|string',
            'menu' => 'nullable|array',
            'amenities' => 'nullable|array',

            'image_url' => 'nullable|string',
            'address' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $restaurant = Restaurant::create($data);

        return response()->json([
            'message' => 'Restaurant created successfully',
            'data' => $restaurant
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'message' => 'Restaurant not found'
            ], 404);
        }

        $data = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'sometimes|string|max:255',

            'rating' => 'nullable|numeric|min:0|max:10',
            'reviews_count' => 'nullable|integer|min:0',
            'rating_text' => 'nullable|string|max:50',

            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',

            'discount_percent' => 'nullable|integer|min:0|max:100',
            'is_promotion' => 'nullable|boolean',
            'promotion_end' => 'nullable|date',

            'description' => 'nullable|string',
            'menu' => 'nullable|array',
            'amenities' => 'nullable|array',

            'image_url' => 'nullable|string',
            'address' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $restaurant->update($data);

        return response()->json([
            'message' => 'Restaurant updated successfully',
            'data' => $restaurant
        ]);
    }

    public function destroy($id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'message' => 'Restaurant not found'
            ], 404);
        }

        $restaurant->delete();

        return response()->json([
            'message' => 'Restaurant deleted successfully'
        ]);
    }
}