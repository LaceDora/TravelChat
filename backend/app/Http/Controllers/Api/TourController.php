<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;

class TourController extends Controller
{
    // 📌 Danh sách tour
    public function index()
    {
        $tours = Tour::with(['departures', 'schedules', 'location.country'])
            ->where('is_active', true)
            ->get()
            ->map(function ($tour) {

                // 👉 lọc tour còn chỗ
                $validDepartures = $tour->departures
                    ->where('status', 'available');

                // 👉 giá thấp nhất
                $minPrice = $validDepartures->min('price');

                // 👉 giảm giá cao nhất
                $maxDiscount = $validDepartures->max('discount_percent');

                // 👉 ngày khởi hành (lấy 2 ngày đầu)
                $dates = $validDepartures
                    ->pluck('departure_date')
                    ->take(2)
                    ->values();

                return [
                    'id' => $tour->id,
                    'name' => $tour->name,
                    'image_url' => $tour->image_url,
                    'days' => $tour->days,
                    'departure_location' => $tour->departure_location,
                    'transport' => $tour->transport,

                    // Thêm country (nếu có)
                    'country' => $tour->location && $tour->location->country
                        ? [
                            'id' => $tour->location->country->id,
                            'name' => $tour->location->country->name,
                        ]
                        : null,

                    // 🔥 cái bạn đang thiếu
                    'price' => $minPrice ?? 0,
                    'discount_percent' => $maxDiscount ?? 0,
                    'combo_content' => $tour->combo_content,

                    'departure_dates' => $dates,

                    // nếu cần chi tiết
                    'departures' => $tour->departures,
                ];
            });

        return response()->json($tours);
    }

    // 📌 Chi tiết tour
    public function show($id)
    {
        $tour = Tour::with(['departures', 'schedules'])
            ->where('is_active', true)
            ->findOrFail($id);

        $validDepartures = $tour->departures
            ->where('status', 'available');

        return response()->json([
            'id' => $tour->id,
            'name' => $tour->name,
            'image_url' => $tour->image_url,
            'days' => $tour->days,
            'departure_location' => $tour->departure_location,
            'transport' => $tour->transport,
            'description' => $tour->description,

            'price' => $validDepartures->min('price') ?? 0,
            'discount_percent' => $validDepartures->max('discount_percent') ?? 0,
            'combo_content' => $tour->combo_content,

            'departures' => $validDepartures->values(),
            'schedules' => $tour->schedules,
        ]);
    }
}