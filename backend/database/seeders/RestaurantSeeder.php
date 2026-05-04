<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $restaurants = [
            [
                'location_id' => 1,
                'name' => 'Nhà hàng Hải Sản Bé Mặn',
                'rating' => 4.6,
                'reviews_count' => 1520,
                'min_price' => 150000,
                'max_price' => 800000,
                'discount_percent' => 10,
                'is_promotion' => true,
                'promotion_end' => '2026-12-31 23:59:59',
                'description' => 'Bé Mặn là cái tên bảo chứng cho hải sản tươi sống tại Đà Nẵng. Với không gian rộng rãi sát biển, thực khách có thể tự tay chọn hải sản đang bơi trong bể và yêu cầu đầu bếp chế biến tại chỗ.',
                'menu' => json_encode([
                    ['name' => 'Tôm hùm xanh hấp', 'price' => 750000],
                    ['name' => 'Ghẹ xanh loại 1', 'price' => 450000],
                    ['name' => 'Mực lá nướng mọi', 'price' => 220000],
                    ['name' => 'Ốc hương rang muối', 'price' => 180000]
                ]),
                'amenities' => json_encode(['Wifi miễn phí', 'Máy điều hòa', 'Bãi đỗ xe rộng', 'Sát bờ biển']),
                'image_url' => 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/5a/85/33/caption.jpg?w=900&h=500&s=1',
                'address' => 'Lô 14 Hoàng Sa, Sơn Trà, Đà Nẵng',
                'lat' => 16.0675,
                'lng' => 108.2430,
            ],
            [
                'location_id' => 3,
                'name' => 'Phở Gia Truyền Bát Đàn',
                'rating' => 4.7,
                'reviews_count' => 3200,
                'min_price' => 40000,
                'max_price' => 80000,
                'discount_percent' => 0,
                'is_promotion' => false,
                'promotion_end' => null,
                'description' => 'Gói gọn tinh hoa phở Việt trong hơn nửa thế kỷ, phở Bát Đàn nổi tiếng với cảnh xếp hàng đợi mua mỗi sáng. Nước dùng trong, thanh vị xương ninh truyền thống.',
                'menu' => json_encode([
                    ['name' => 'Phở bò tái nạm', 'price' => 60000],
                    ['name' => 'Phở chín đặc biệt', 'price' => 55000],
                    ['name' => 'Quẩy giòn nóng', 'price' => 10000],
                    ['name' => 'Trứng chần', 'price' => 10000]
                ]),
                'amenities' => json_encode(['Không gian hoài cổ', 'Wifi', 'Phục vụ tận tâm']),
                'image_url' => 'https://mia.vn/media/uploads/blog-du-lich/Pho-bat-dan-pho-gia-truyen-100-nam-tuoi-tai-ha-noi-01-1639325605.jpg',
                'address' => '49 Bát Đàn, Hoàn Kiếm, Hà Nội',
                'lat' => 21.0340,
                'lng' => 105.8485,
            ],
            [
                'location_id' => 6,
                'name' => 'Nhà hàng Cua Vàng Hạ Long',
                'rating' => 4.5,
                'reviews_count' => 980,
                'min_price' => 200000,
                'max_price' => 1000000,
                'discount_percent' => 15,
                'is_promotion' => true,
                'promotion_end' => '2026-11-30 23:59:59',
                'description' => 'Đúng như tên gọi, nhà hàng là thiên đường cho các tín đồ mê cua biển Hạ Long. Không gian sang trọng phù hợp cho những bữa tiệc cao cấp.',
                'menu' => json_encode([
                    ['name' => 'Cua biển rang me', 'price' => 550000],
                    ['name' => 'Cua hấp nguyên con', 'price' => 480000],
                    ['name' => 'Lẩu hải sản Cua Vàng', 'price' => 850000],
                    ['name' => 'Miến xào cua', 'price' => 250000]
                ]),
                'amenities' => json_encode(['View biển cực đẹp', 'Phòng VIP riêng tư', 'Wifi', 'Dàn karaoke']),
                'image_url' => 'https://mia.vn/media/uploads/blog-du-lich/nha-hang-cua-vang-bai-chay-nha-hang-duy-nhat-o-viet-nam-co-mon-nay-1-1641883057.jpeg',
                'address' => '32 Phan Chu Trinh, Hạ Long',
                'lat' => 20.9550,
                'lng' => 107.0850,
            ],
            [
                'location_id' => 7,
                'name' => 'Lẩu Gà Lá É Tao Ngộ',
                'rating' => 4.6,
                'reviews_count' => 2100,
                'min_price' => 100000,
                'max_price' => 350000,
                'discount_percent' => 5,
                'is_promotion' => true,
                'promotion_end' => '2026-10-10 23:59:59',
                'description' => 'Món lẩu đặc trưng nhất Đà Lạt. Vị ngọt của gà ta hòa cùng vị cay nồng đặc trưng của lá é tạo nên sức hút khó cưỡng giữa không gian se lạnh.',
                'menu' => json_encode([
                    ['name' => 'Lẩu gà lá é (Lớn)', 'price' => 350000],
                    ['name' => 'Gỏi gà hành tây', 'price' => 150000],
                    ['name' => 'Cháo gà đậu xanh', 'price' => 80000]
                ]),
                'amenities' => json_encode(['Sân vườn rộng', 'View đồi núi', 'Không gian ấm cúng']),
                'image_url' => 'https://mia.vn/media/uploads/blog-du-lich/lau-ga-la-e-tao-ngo-da-lat-pham-ngu-lao-1722768560.jpg',
                'address' => '5 Đường 3/4, Đà Lạt',
                'lat' => 11.9415,
                'lng' => 108.4419,
            ],
            [
                'location_id' => 8,
                'name' => 'Ra Khơi Restaurant Phú Quốc',
                'rating' => 4.7,
                'reviews_count' => 1750,
                'min_price' => 200000,
                'max_price' => 900000,
                'discount_percent' => 20,
                'is_promotion' => true,
                'promotion_end' => '2026-09-01 23:59:59',
                'description' => 'Ra Khơi là điểm đến ẩm thực không thể bỏ qua tại trung tâm Dương Đông. Nhà hàng nổi tiếng với nguồn nguyên liệu tươi rói từ đảo Ngọc.',
                'menu' => json_encode([
                    ['name' => 'Nhum biển nướng trứng', 'price' => 55000],
                    ['name' => 'Ốc hương rang muối', 'price' => 280000],
                    ['name' => 'Cá mú nướng mọi', 'price' => 450000],
                    ['name' => 'Tôm mũ ni cháy tỏi', 'price' => 750000]
                ]),
                'amenities' => json_encode(['View biển thoáng mát', 'BBQ ngoài trời', 'Wifi', 'Bãi đỗ xe']),
                'image_url' => 'https://d2kihw5e8drjh5.cloudfront.net/eyJidWNrZXQiOiJ1dGEtaW1hZ2VzIiwia2V5IjoicGxhY2VfaW1nL3Z0SnRabF9lVEl5Zmh4ZUs0ZVJrclEiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjY0MCwiaGVpZ2h0Ijo2NDAsImZpdCI6Imluc2lkZSJ9LCJyb3RhdGUiOm51bGwsInRvRm9ybWF0IjogIndlYnAifX0=',
                'address' => '131 Đường 30/4, Dương Đông, Phú Quốc',
                'lat' => 10.2190,
                'lng' => 103.9600,
            ],
        ];

        foreach ($restaurants as &$restaurant) {
            $restaurant['created_at'] = $now;
            $restaurant['updated_at'] = $now;
        }

        DB::table('restaurants')->insert($restaurants);
    }
}