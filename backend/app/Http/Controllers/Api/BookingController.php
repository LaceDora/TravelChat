<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    private function bookingRelations(): array
    {
        return [
            'tour:id,name',
            'hotel:id,name',
            'restaurant:id,name',
        ];
    }

    public function store(Request $request)
    {
        try {
            $userId = auth()->id() ?? $request->user_id;

            if (!$userId) {
                return response()->json(['message' => 'Unauthenticated', 'debug' => 'No user_id'], 401);
            }

            $payload = [
                'user_id' => $userId,
                'booking_type' => $request->booking_type,
                'target_id' => $request->target_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'booking_date' => $request->booking_date,
                'quantity' => $request->quantity,
                'total_amount' => $request->total_amount,
                'note' => $request->note,
            ];

            $existingPendingBooking = Booking::query()
                ->where('user_id', $userId)
                ->where('booking_type', $request->booking_type)
                ->where('target_id', $request->target_id)
                ->where('status', 'pending')
                ->when(
                    $request->filled('booking_date'),
                    fn ($query) => $query->whereDate('booking_date', $request->booking_date),
                    fn ($query) => $query->whereNull('booking_date')
                )
                ->latest('id')
                ->first();

            if ($existingPendingBooking) {
                $existingPendingBooking->fill($payload);
                $existingPendingBooking->status = 'pending';
                $existingPendingBooking->save();

                return response()->json(
                    $existingPendingBooking->load($this->bookingRelations())
                );
            }

            $booking = Booking::create($payload + [
                'status' => 'pending',
            ]);

            return response()->json($booking->load($this->bookingRelations()));
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
            Booking::with($this->bookingRelations())
                ->where('user_id', $userId)
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function show($id)
    {
        $userId = auth()->id() ?? request('user_id');
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $booking = Booking::with($this->bookingRelations())
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();

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

        $booking = Booking::with($this->bookingRelations())
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();

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

        return response()->json([
            'message' => 'Đã hủy booking',
            'booking' => $booking->fresh()->load($this->bookingRelations()),
        ]);
    }
}