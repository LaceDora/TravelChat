<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TourScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Xóa dữ liệu cũ để tránh trùng lặp nếu bạn chạy lệnh seed nhiều lần
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // DB::table('tour_schedules')->truncate();
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $schedules = [
            // TOUR 1: Đà Nẵng 3N2Đ
            ['tour_id' => 1, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Khởi hành', 'activity' => 'Bay TP.HCM → Đà Nẵng, nhận phòng'],
            ['tour_id' => 1, 'day_number' => 1, 'time' => 'Chiều', 'title' => 'Tham quan', 'activity' => 'Ngũ Hành Sơn, phố cổ Hội An'],
            ['tour_id' => 1, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Bà Nà Hills', 'activity' => 'Đi cáp treo, check-in Cầu Vàng'],
            ['tour_id' => 1, 'day_number' => 3, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Tự do, bay về'],

            // TOUR 2: Hà Nội 2N
            ['tour_id' => 2, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Di chuyển', 'activity' => 'Từ Hải Phòng → Hà Nội'],
            ['tour_id' => 2, 'day_number' => 1, 'time' => 'Chiều', 'title' => 'Tham quan', 'activity' => 'Hồ Gươm, phố cổ, xích lô'],
            ['tour_id' => 2, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Văn hóa', 'activity' => 'Lăng Bác, Văn Miếu'],
            ['tour_id' => 2, 'day_number' => 2, 'time' => 'Tối', 'title' => 'Giải trí', 'activity' => 'Xem múa rối nước'],

            // TOUR 3: Bangkok - Pattaya 4N
            ['tour_id' => 3, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'TP.HCM → Bangkok'],
            ['tour_id' => 3, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Hoàng cung', 'activity' => 'Tham quan Grand Palace'],
            ['tour_id' => 3, 'day_number' => 3, 'time' => 'Chiều', 'title' => 'Pattaya', 'activity' => 'Biển + show Alcazar'],
            ['tour_id' => 3, 'day_number' => 4, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Mua sắm, về nước'],

            // TOUR 4: Singapore 3N
            ['tour_id' => 4, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'TP.HCM → Singapore'],
            ['tour_id' => 4, 'day_number' => 1, 'time' => 'Chiều', 'title' => 'City tour', 'activity' => 'Marina Bay, Merlion'],
            ['tour_id' => 4, 'day_number' => 2, 'time' => 'Cả ngày', 'title' => 'Vui chơi', 'activity' => 'Universal Studios'],
            ['tour_id' => 4, 'day_number' => 3, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Mua sắm, về'],

            // TOUR 5: Bali 5N
            ['tour_id' => 5, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'TP.HCM → Bali'],
            ['tour_id' => 5, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Check-in', 'activity' => 'Cổng trời Lempuyang'],
            ['tour_id' => 5, 'day_number' => 3, 'time' => 'Chiều', 'title' => 'Trải nghiệm', 'activity' => 'Bali Swing, ruộng bậc thang'],
            ['tour_id' => 5, 'day_number' => 4, 'time' => 'Chiều', 'title' => 'Biển', 'activity' => 'Tanah Lot, ăn tối Jimbaran'],
            ['tour_id' => 5, 'day_number' => 5, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về nước'],

            // TOUR 6: Tokyo 4N
            ['tour_id' => 6, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'Hà Nội → Tokyo'],
            ['tour_id' => 6, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Tham quan', 'activity' => 'Đền Senso-ji'],
            ['tour_id' => 6, 'day_number' => 3, 'time' => 'Cả ngày', 'title' => 'Phú Sĩ', 'activity' => 'Tham quan núi Phú Sĩ'],
            ['tour_id' => 6, 'day_number' => 4, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Mua sắm, về'],

            // TOUR 7: Seoul - Nami 4N
            ['tour_id' => 7, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'Hà Nội → Seoul'],
            ['tour_id' => 7, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Văn hóa', 'activity' => 'Cung Gyeongbokgung'],
            ['tour_id' => 7, 'day_number' => 3, 'time' => 'Cả ngày', 'title' => 'Nami', 'activity' => 'Tham quan đảo Nami'],
            ['tour_id' => 7, 'day_number' => 4, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về nước'],

            // TOUR 8: Bắc Kinh 5N
            ['tour_id' => 8, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Bay', 'activity' => 'TP.HCM → Bắc Kinh'],
            ['tour_id' => 8, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Vạn Lý', 'activity' => 'Tham quan Vạn Lý Trường Thành'],
            ['tour_id' => 8, 'day_number' => 3, 'time' => 'Sáng', 'title' => 'Tử Cấm', 'activity' => 'Tham quan Tử Cấm Thành'],
            ['tour_id' => 8, 'day_number' => 4, 'time' => 'Chiều', 'title' => 'Di Hòa Viên', 'activity' => 'Tham quan'],
            ['tour_id' => 8, 'day_number' => 5, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về'],

            // TOUR 9: Lào 3N
            ['tour_id' => 9, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Xe', 'activity' => 'Từ Nghệ An → Lào'],
            ['tour_id' => 9, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Kuang Si', 'activity' => 'Tham quan thác'],
            ['tour_id' => 9, 'day_number' => 2, 'time' => 'Chiều', 'title' => 'Tâm linh', 'activity' => 'Chùa, khất thực'],
            ['tour_id' => 9, 'day_number' => 3, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về'],

            // TOUR 10: Campuchia 3N
            ['tour_id' => 10, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Xe', 'activity' => 'TP.HCM → Campuchia'],
            ['tour_id' => 10, 'day_number' => 2, 'time' => 'Cả ngày', 'title' => 'Angkor', 'activity' => 'Tham quan Angkor Wat, Ta Prohm'],
            ['tour_id' => 10, 'day_number' => 3, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về'],

            // TOUR 11: Hạ Long 2N
            ['tour_id' => 11, 'day_number' => 1, 'time' => 'Sáng', 'title' => 'Di chuyển', 'activity' => 'Hà Nội → Hạ Long'],
            ['tour_id' => 11, 'day_number' => 1, 'time' => 'Chiều', 'title' => 'Du thuyền', 'activity' => 'Tham quan hang, kayak'],
            ['tour_id' => 11, 'day_number' => 1, 'time' => 'Tối', 'title' => 'Trải nghiệm', 'activity' => 'Câu mực, tiệc tối'],
            ['tour_id' => 11, 'day_number' => 2, 'time' => 'Sáng', 'title' => 'Kết thúc', 'activity' => 'Về Hà Nội'],
        ];

        // Tự động thêm timestamps cho từng bản ghi
        foreach ($schedules as &$item) {
            $item['created_at'] = $now;
            $item['updated_at'] = $now;
        }

        DB::table('tour_schedules')->insert($schedules);
    }
}