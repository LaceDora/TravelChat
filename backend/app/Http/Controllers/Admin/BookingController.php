<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    // Lấy danh sách booking
    public function index(Request $request)
    {
        $query = Booking::with('user');
        // Có thể thêm filter ở đây nếu cần
        $bookings = $query->orderByDesc('id')->get();
        return response()->json($bookings);
    }

    // Lấy chi tiết booking
    public function show($id)
    {
        $booking = Booking::with('user')->findOrFail($id);
        return response()->json($booking);
    }

    // Cập nhật trạng thái booking
    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $request->validate([
            'status' => 'required|string',
        ]);
        $booking->status = $request->input('status');
        $booking->save();
        return response()->json($booking);
    }
}
