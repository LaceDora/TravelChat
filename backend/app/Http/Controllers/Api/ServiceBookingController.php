<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\HotelRoom;
use App\Models\RestaurantTable;
use Illuminate\Support\Facades\Auth;

class ServiceBookingController extends Controller
{
    /**
     * Lấy danh sách phòng hoặc bàn theo service
     */
    public function getOptions(Request $request)
    {
        $serviceId = $request->service_id;
        $type = $request->type; // room | table

        if ($type === 'room') {
            return response()->json(
                HotelRoom::where('service_id', $serviceId)
                    ->where('status', 'available')
                    ->get()
            );
        }

        if ($type === 'table') {
            return response()->json(
                RestaurantTable::where('service_id', $serviceId)
                    ->where('status', 'available')
                    ->get()
            );
        }

        return response()->json(['message' => 'Invalid type'], 400);
    }

    /**
     * Đặt dịch vụ (dùng chung bảng bookings)
     */
    public function store(Request $request)
    {
        $request->validate([
            'service_id'   => 'required|integer',
            'booking_date' => 'required|date',
            'booking_time' => 'required',
            'type'         => 'required|in:room,table',
            'option_id'    => 'required|integer',
            'quantity'     => 'nullable|integer',
            'note'         => 'nullable|string'
        ]);

        $booking = Booking::create([
            'user_id'      => Auth::id(),
            'booking_type' => 'service',
            'service_id'   => $request->service_id,
            'room_id'      => $request->type === 'room' ? $request->option_id : null,
            'table_id'     => $request->type === 'table' ? $request->option_id : null,
            'booking_date' => $request->booking_date,
            'booking_time' => $request->booking_time,
            'quantity'     => $request->quantity ?? 1,
            'note'         => $request->note,
            'status'       => 'pending'
        ]);

        return response()->json([
            'message' => 'Đặt dịch vụ thành công',
            'booking' => $booking
        ], 201);
    }

    /**
     * Danh sách booking dịch vụ của user
     */
    public function myBookings()
    {
        return response()->json(
            Booking::where('user_id', Auth::id())
                ->where('booking_type', 'service')
                ->with(['room', 'table'])
                ->latest()
                ->get()
        );
    }
}
