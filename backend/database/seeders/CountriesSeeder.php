<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountriesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('countries')->insert([
    ['code' => 'VN', 'name' => 'Việt Nam', 'cover_url' => 'vn.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'TH', 'name' => 'Thái Lan', 'cover_url' => 'th.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'LA', 'name' => 'Lào', 'cover_url' => 'la.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'KH', 'name' => 'Campuchia', 'cover_url' => 'kh.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'ID', 'name' => 'Indonesia', 'cover_url' => 'id.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'NB', 'name' => 'Nhật Bản', 'cover_url' => 'nb.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'SG', 'name' => 'Singapore', 'cover_url' => 'sg.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'TQ', 'name' => 'Trung Quốc', 'cover_url' => 'tq.jpg', 'created_at' => now(), 'updated_at' => now()],
    ['code' => 'HQ', 'name' => 'Hàn Quốc', 'cover_url' => 'hq.jpg', 'created_at' => now(), 'updated_at' => now()],
]);
    }
}