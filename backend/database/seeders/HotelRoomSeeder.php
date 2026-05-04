<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HotelRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $rooms = [
            // InterContinental Đà Nẵng (hotel_id = 1)
            [
                'hotel_id' => 1,
                'name' => 'Classic Room',
                'price_per_night' => 8000000,
                'discount_percent' => 10,
                'capacity' => 2,
                'quantity' => 10,
                'bed_type' => 'King Bed',
                'area' => 45,
                'dynamic_price' => json_encode(['weekend' => 9000000]),
                'description' => 'Phòng tiêu chuẩn view biển',
            ],
            [
                'hotel_id' => 1,
                'name' => 'Villa Ocean View',
                'price_per_night' => 15000000,
                'discount_percent' => 15,
                'capacity' => 4,
                'quantity' => 5,
                'bed_type' => 'King + Twin',
                'area' => 120,
                'dynamic_price' => json_encode(['holiday' => 18000000]),
                'description' => 'Biệt thự riêng view biển',
            ],

            // Lotte Hà Nội (hotel_id = 2)
            [
                'hotel_id' => 2,
                'name' => 'Deluxe Room',
                'price_per_night' => 2500000,
                'discount_percent' => 5,
                'capacity' => 2,
                'quantity' => 20,
                'bed_type' => 'King Bed',
                'area' => 40,
                'dynamic_price' => json_encode(['weekend' => 2800000]),
                'description' => 'Phòng cao cấp view thành phố',
            ],
            [
                'hotel_id' => 2,
                'name' => 'Suite Room',
                'price_per_night' => 5000000,
                'discount_percent' => 10,
                'capacity' => 3,
                'quantity' => 8,
                'bed_type' => 'King Bed',
                'area' => 80,
                'dynamic_price' => json_encode(['holiday' => 5500000]),
                'description' => 'Phòng suite sang trọng',
            ],

            // Vinpearl Hạ Long (hotel_id = 3)
            [
                'hotel_id' => 3,
                'name' => 'Deluxe Sea View',
                'price_per_night' => 3000000,
                'discount_percent' => 10,
                'capacity' => 2,
                'quantity' => 15,
                'bed_type' => 'Double Bed',
                'area' => 42,
                'dynamic_price' => null,
                'description' => 'View vịnh Hạ Long',
            ],
            [
                'hotel_id' => 3,
                'name' => 'Executive Suite',
                'price_per_night' => 6000000,
                'discount_percent' => 15,
                'capacity' => 3,
                'quantity' => 6,
                'bed_type' => 'King Bed',
                'area' => 90,
                'dynamic_price' => json_encode(['holiday' => 6500000]),
                'description' => 'Phòng suite cao cấp',
            ],

            // Đà Lạt Palace (hotel_id = 4)
            [
                'hotel_id' => 4,
                'name' => 'Superior Room',
                'price_per_night' => 2000000,
                'discount_percent' => 5,
                'capacity' => 2,
                'quantity' => 12,
                'bed_type' => 'Queen Bed',
                'area' => 35,
                'dynamic_price' => null,
                'description' => 'Phong cách cổ điển Pháp',
            ],
            [
                'hotel_id' => 4,
                'name' => 'Luxury Suite',
                'price_per_night' => 4000000,
                'discount_percent' => 10,
                'capacity' => 3,
                'quantity' => 5,
                'bed_type' => 'King Bed',
                'area' => 70,
                'dynamic_price' => json_encode(['weekend' => 4500000]),
                'description' => 'Phòng rộng sang trọng',
            ],

            // JW Marriott Phú Quốc (hotel_id = 5)
            [
                'hotel_id' => 5,
                'name' => 'Emerald Bay Room',
                'price_per_night' => 7000000,
                'discount_percent' => 15,
                'capacity' => 2,
                'quantity' => 10,
                'bed_type' => 'King Bed',
                'area' => 50,
                'dynamic_price' => json_encode(['weekend' => 7500000]),
                'description' => 'View biển tuyệt đẹp',
            ],
            [
                'hotel_id' => 5,
                'name' => 'Pool Villa',
                'price_per_night' => 14000000,
                'discount_percent' => 20,
                'capacity' => 4,
                'quantity' => 4,
                'bed_type' => 'King + Twin',
                'area' => 150,
                'dynamic_price' => json_encode(['holiday' => 16000000]),
                'description' => 'Villa hồ bơi riêng',
            ],
        ];

        foreach ($rooms as &$room) {
            $room['created_at'] = $now;
            $room['updated_at'] = $now;
        }

        DB::table('hotel_rooms')->insert($rooms);
    }
}