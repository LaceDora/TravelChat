<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RestaurantTable;

class RestaurantTableController extends Controller
{
    public function byRestaurant($restaurantId)
    {
        return response()->json(
            RestaurantTable::where('restaurant_id', $restaurantId)
                ->orderBy('id', 'desc')
                ->get()
        );
    }

    public function show($id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Restaurant table not found'
            ], 404);
        }

        return response()->json($table);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'quantity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'dynamic_price' => 'nullable|array',
            'note' => 'nullable|string'
        ]);

        $table = RestaurantTable::create($data);

        return response()->json([
            'message' => 'Restaurant table created successfully',
            'data' => $table
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Restaurant table not found'
            ], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'quantity' => 'sometimes|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'dynamic_price' => 'nullable|array',
            'note' => 'nullable|string'
        ]);

        $table->update($data);

        return response()->json([
            'message' => 'Restaurant table updated successfully',
            'data' => $table
        ]);
    }

    public function destroy($id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Restaurant table not found'
            ], 404);
        }

        $table->delete();

        return response()->json([
            'message' => 'Restaurant table deleted successfully'
        ]);
    }
}