<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HotelRoom;
use Illuminate\Http\Request;

class HotelRoomController extends Controller
{
    public function byHotel($hotelId)
    {
        return response()->json(
            HotelRoom::with('hotel')->where('hotel_id', $hotelId)->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            HotelRoom::with('hotel')->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'name' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'capacity' => 'nullable|integer|min:1',
            'quantity' => 'nullable|integer|min:1',
            'bed_type' => 'nullable|string|max:100',
            'area' => 'nullable|integer|min:1',
            'dynamic_price' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $room = HotelRoom::create($data);

        return response()->json($room);
    }

    public function update(Request $request, $id)
    {
        $room = HotelRoom::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price_per_night' => 'sometimes|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'capacity' => 'nullable|integer|min:1',
            'quantity' => 'nullable|integer|min:1',
            'bed_type' => 'nullable|string|max:100',
            'area' => 'nullable|integer|min:1',
            'dynamic_price' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $room->update($data);

        return response()->json($room);
    }

    public function destroy($id)
    {
        $room = HotelRoom::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Deleted']);
    }
}