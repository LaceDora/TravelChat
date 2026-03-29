<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        try {
            $userId = auth()->id() ?? $request->user_id;

            if (!$userId) {
                return response()->json(['message' => 'Unauthenticated', 'debug' => 'No user_id'], 401);
            }

            $booking = Booking::create([
                'user_id' => $userId,
                'booking_type' => $request->booking_type,
                'target_id' => $request->target_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'booking_date' => $request->booking_date,
                'quantity' => $request->quantity,
                'total_amount' => $request->total_amount,
            ]);

            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function myBookings()
    {
        $userId = auth()->id() ?? request('user_id');
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(
            Booking::where('user_id', $userId)->get()
        );
    }

    public function show($id)
    {
        $userId = auth()->id() ?? request('user_id');
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $booking = Booking::where('id', $id)->where('user_id', $userId)->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        return response()->json($booking);
    }

    public function cancel($id)
    {
        $userId = auth()->id() ?? request('user_id');
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $booking = Booking::where('id', $id)->where('user_id', $userId)->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['message' => 'Booking đã hủy'], 400);
        }

        if ($booking->status === 'paid') {
            return response()->json(['message' => 'Booking đã thanh toán, không thể hủy'], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Đã hủy booking', 'booking' => $booking]);
    }
}