<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Các bảng độc lập (không có khóa ngoại hoặc là bảng cha cao nhất)
            CountriesSeeder::class,     // Cần cho Users và Locations
            BlogSeeder::class,          // Độc lập

            // 2. Các bảng phụ thuộc vào Countries
            LocationsSeeder::class,      // Cần cho Tours, Restaurants, Hotels

            // 3. Các bảng phụ thuộc vào Locations
            TourSeeder::class,           // Cần cho TourSchedules và TourDepartures
            RestaurantSeeder::class,     // Cần cho RestaurantTables
            HotelSeeder::class,          // Cần cho HotelRooms

            // 4. Các bảng cấp 3 (Phụ thuộc vào Tours, Restaurants, Hotels)
            TourScheduleSeeder::class,
            TourDepartureSeeder::class,
            RestaurantTableSeeder::class,
            HotelRoomSeeder::class,
            
            // Nếu bạn có UserSeeder thì nên để ở cuối cùng sau Countries
            // UserSeeder::class, 
        ]);
    }
}