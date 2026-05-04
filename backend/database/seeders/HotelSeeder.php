<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $hotels = [
            [
                'location_id' => 1,
                'name' => 'InterContinental Danang Sun Peninsula Resort',
                'rating' => 4.9,
                'reviews_count' => 2500,
                'rating_text' => 'Xuất sắc',
                'price_per_night' => 8000000,
                'discount_percent' => 15,
                'is_promotion' => true,
                'promotion_end' => '2026-12-31 23:59:59',
                'combo_content' => 'Gói nghỉ dưỡng bao gồm: Buffet sáng thượng hạng tại nhà hàng Citron, xe đưa đón sân bay riêng biệt, trà chiều miễn phí và ưu đãi 20% các dịch vụ Spa tại HARNN Heritage.',
                'description' => 'Tọa lạc tại bán đảo Sơn Trà, đây là kiệt tác của kiến trúc sư Bill Bensley. Resort trải dài qua 4 tầng: Heaven, Sky, Earth và Sea, mang đến không gian nghỉ dưỡng biệt lập với view biển 180 độ.',
                'amenities' => json_encode(['Hồ bơi vô cực', 'HARNN Heritage Spa', 'Phòng Gym hiện đại', 'Bãi biển riêng', 'Câu lạc bộ trẻ em', 'Rạp chiếu phim']),
                'image_url' => 'https://duan-sungroup.com/wp-content/uploads/2022/12/intercontinental-da-nang-sun-peninsula-resort-leading.png',
                'address' => 'Bãi Bắc, Sơn Trà, Đà Nẵng',
                'lat' => 16.1300,
                'lng' => 108.3000,
            ],
            [
                'location_id' => 3,
                'name' => 'Lotte Hotel Hanoi',
                'rating' => 4.8,
                'reviews_count' => 3200,
                'rating_text' => 'Xuất sắc',
                'price_per_night' => 2500000,
                'discount_percent' => 10,
                'is_promotion' => true,
                'promotion_end' => '2026-11-30 23:59:59',
                'combo_content' => 'Ưu đãi đặt phòng: Tặng vé tham quan đài quan sát Sky Walk, miễn phí sử dụng hồ bơi bốn mùa và sauna, giảm 10% tại các nhà hàng trong khách sạn.',
                'description' => 'Nằm từ tầng 33 đến tầng 65 của tòa nhà Lotte Center hiện đại, Lotte Hotel Hanoi là sự kết nối giữa khu phố cổ lâu đời và khu đô thị mới đang phát triển.',
                'amenities' => json_encode(['Hồ bơi bốn mùa', 'Trung tâm thể hình', 'Nhà hàng Top of Hanoi', 'Bar tầng thượng', 'Dịch vụ Spa', 'Business Center']),
                'image_url' => 'https://i.ex-cdn.com/theinvestor.vn/files/content/2022/06/20/lottehotel-1200x809-1022.jpg',
                'address' => '54 Liễu Giai, Ba Đình, Hà Nội',
                'lat' => 21.0330,
                'lng' => 105.8130,
            ],
            [
                'location_id' => 6,
                'name' => 'Vinpearl Resort & Spa Hạ Long',
                'rating' => 4.7,
                'reviews_count' => 1800,
                'rating_text' => 'Rất tốt',
                'price_per_night' => 3000000,
                'discount_percent' => 20,
                'is_promotion' => true,
                'promotion_end' => '2026-10-30 23:59:59',
                'combo_content' => 'Combo kỳ nghỉ: Vé tham quan vịnh Hạ Long, buffet sáng tiêu chuẩn 5 sao, miễn phí tàu cao tốc ra đảo Đảo Rều và voucher sử dụng dịch vụ Vincharm Spa.',
                'description' => 'Được lấy cảm hứng từ nhà hát thành phố Rennes (Pháp), Vinpearl Hạ Long như một lâu đài tráng lệ nổi trên mặt biển với 4 mặt giáp vịnh.',
                'amenities' => json_encode(['Hồ bơi ngoài trời', 'Vincharm Spa', 'Bãi biển nhân tạo', 'Nhà hàng Akoya', 'Khu vui chơi trẻ em']),
                'image_url' => 'https://statics.vinpearl.com/HL_1730783888.jpg',
                'address' => 'Đảo Rều, Hạ Long',
                'lat' => 20.9500,
                'lng' => 107.1000,
            ],
            [
                'location_id' => 7,
                'name' => 'Dalat Palace Heritage Hotel',
                'rating' => 4.6,
                'reviews_count' => 1400,
                'rating_text' => 'Tuyệt vời',
                'price_per_night' => 2000000,
                'discount_percent' => 5,
                'is_promotion' => true,
                'promotion_end' => '2026-09-15 23:59:59',
                'combo_content' => 'Nghỉ dưỡng phong cách hoàng gia: Ăn sáng kiểu Pháp tại nhà hàng Le Rabelais, thưởng thức trà chiều trong khuôn viên sân vườn cổ kính.',
                'description' => 'Xây dựng từ năm 1922, Dalat Palace là biểu tượng cho sự sang trọng mang đậm dấu ấn kiến trúc Pháp cổ điển nhìn thẳng ra hồ Xuân Hương.',
                'amenities' => json_encode(['Sân vườn rộng lớn', 'Nhà hàng Le Rabelais', 'Hầm rượu vang', 'Dịch vụ Massage', 'Sân Tennis']),
                'image_url' => 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/680499762.jpg?k=3b9add0bca4625414ebec50dc7d564addcd9e1b387998191e49933ab081b15a0&o=',
                'address' => '02 Trần Phú, Đà Lạt',
                'lat' => 11.9400,
                'lng' => 108.4370,
            ],
            [
                'location_id' => 8,
                'name' => 'JW Marriott Phu Quoc Emerald Bay',
                'rating' => 4.9,
                'reviews_count' => 2100,
                'rating_text' => 'Xuất sắc',
                'price_per_night' => 7000000,
                'discount_percent' => 25,
                'is_promotion' => true,
                'promotion_end' => '2026-12-01 23:59:59',
                'combo_content' => 'Ưu đãi đặc biệt: Tham gia lớp học làm đèn lồng và nấu ăn, giảm 25% giá phòng cho kỳ nghỉ trên 3 đêm, tặng 01 liệu trình massage.',
                'description' => 'Với concept là một trường đại học cổ giả tưởng, resort mang đến trải nghiệm thị giác kinh ngạc tọa lạc tại Bãi Khem - bãi biển đẹp nhất Phú Quốc.',
                'amenities' => json_encode(['Hồ bơi vỏ sò', 'Chanterelle Spa', 'Bãi biển riêng biệt', 'Nhà hàng Pink Pearl', 'Lớp học yoga', 'Trung tâm thể thao nước']),
                'image_url' => 'https://duan-sungroup.com/wp-content/uploads/2022/12/JW-Marriott-Phu-Quoc-Emerald-Bay-Resort-leading.png',
                'address' => 'Bãi Khem, Phú Quốc',
                'lat' => 10.0450,
                'lng' => 104.0350,
            ],
        ];

        foreach ($hotels as &$hotel) {
            $hotel['created_at'] = $now;
            $hotel['updated_at'] = $now;
        }

        DB::table('hotels')->insert($hotels);
    }
}