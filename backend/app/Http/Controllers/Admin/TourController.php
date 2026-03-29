<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;

class TourController extends Controller
{
    /**
     * Get all tours
     */
    public function index()
    {
        $tours = Tour::with('location')->latest()->get();
        return response()->json($tours);
    }

    /**
     * Get single tour
     */
    public function show($id)
    {
        $tour = Tour::with('location')->findOrFail($id);

        return response()->json($tour);
    }

    /**
     * Create tour
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'required|string|max:255',
            'days' => 'nullable|integer|min:1',
            'price' => 'required|numeric',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'combo_content' => 'nullable|string',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string'
        ]);

        $tour = Tour::create($validated);

        return response()->json([
            'message' => 'Tour created successfully',
            'data' => $tour
        ], 201);
    }

    /**
     * Update tour
     */
    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $validated = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'name' => 'required|string|max:255',
            'days' => 'nullable|integer|min:1',
            'price' => 'required|numeric',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'combo_content' => 'nullable|string',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string'
        ]);

        $tour->update($validated);

        return response()->json([
            'message' => 'Tour updated successfully',
            'data' => $tour
        ]);
    }

    /**
     * Delete tour
     */
    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);

        $tour->delete();

        return response()->json([
            'message' => 'Tour deleted successfully'
        ]);
    }
}