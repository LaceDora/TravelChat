<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RestaurantTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $tables = [
            // Bé Mặn (Đà Nẵng) - Giả định restaurant_id = 1
            [
                'restaurant_id' => 1,
                'name' => 'Bàn 2 người',
                'capacity' => 2,
                'quantity' => 10,
                'price' => 100000,
                'discount_percent' => 10,
                'dynamic_price' => json_encode(['weekend' => 120000]),
                'note' => 'Gần biển',
            ],
            [
                'restaurant_id' => 1,
                'name' => 'Bàn 6 người',
                'capacity' => 6,
                'quantity' => 5,
                'price' => 300000,
                'discount_percent' => 5,
                'dynamic_price' => json_encode(['weekend' => 350000]),
                'note' => 'Nhóm bạn',
            ],

            // Bát Đàn (Hà Nội) - Giả định restaurant_id = 2
            [
                'restaurant_id' => 2,
                'name' => 'Bàn nhỏ',
                'capacity' => 2,
                'quantity' => 15,
                'price' => 50000,
                'discount_percent' => 0,
                'dynamic_price' => null,
                'note' => 'Không gian trong nhà',
            ],
            [
                'restaurant_id' => 2,
                'name' => 'Bàn gia đình',
                'capacity' => 4,
                'quantity' => 8,
                'price' => 100000,
                'discount_percent' => 0,
                'dynamic_price' => null,
                'note' => 'Ngồi chung bàn dài',
            ],

            // Cua Vàng (Hạ Long) - Giả định restaurant_id = 3
            [
                'restaurant_id' => 3,
                'name' => 'Bàn VIP',
                'capacity' => 4,
                'quantity' => 4,
                'price' => 500000,
                'discount_percent' => 10,
                'dynamic_price' => json_encode(['holiday' => 600000]),
                'note' => 'Phòng riêng',
            ],
            [
                'restaurant_id' => 3,
                'name' => 'Bàn view biển',
                'capacity' => 2,
                'quantity' => 6,
                'price' => 250000,
                'discount_percent' => 0,
                'dynamic_price' => null,
                'note' => 'Nhìn ra vịnh',
            ],

            // Lẩu gà lá é (Đà Lạt) - Giả định restaurant_id = 4
            [
                'restaurant_id' => 4,
                'name' => 'Bàn đôi',
                'capacity' => 2,
                'quantity' => 8,
                'price' => 80000,
                'discount_percent' => 5,
                'dynamic_price' => null,
                'note' => 'Không gian chill',
            ],
            [
                'restaurant_id' => 4,
                'name' => 'Bàn nhóm',
                'capacity' => 5,
                'quantity' => 5,
                'price' => 200000,
                'discount_percent' => 10,
                'dynamic_price' => null,
                'note' => 'Ngoài trời',
            ],

            // Ra Khơi (Phú Quốc) - Giả định restaurant_id = 5
            [
                'restaurant_id' => 5,
                'name' => 'Bàn BBQ',
                'capacity' => 4,
                'quantity' => 6,
                'price' => 350000,
                'discount_percent' => 15,
                'dynamic_price' => json_encode(['weekend' => 400000]),
                'note' => 'Nướng ngoài trời',
            ],
            [
                'restaurant_id' => 5,
                'name' => 'Bàn VIP',
                'capacity' => 6,
                'quantity' => 3,
                'price' => 700000,
                'discount_percent' => 20,
                'dynamic_price' => json_encode(['holiday' => 800000]),
                'note' => 'Phòng lạnh cao cấp',
            ],
        ];

        foreach ($tables as &$table) {
            $table['created_at'] = $now;
            $table['updated_at'] = $now;
        }

        DB::table('restaurant_tables')->insert($tables);
    }
}