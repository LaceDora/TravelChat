<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Tùy chọn: Xóa dữ liệu cũ để tránh trùng lặp khi chạy lại lệnh seed
        // DB::table('tours')->truncate(); 

        DB::table('tours')->insert([
            [
                'location_id' => 1,
                'name' => 'Tour Đà Nẵng 3N2Đ: Đường lên Tiên Cảnh',
                'days' => 3,
                'transport' => 'Máy bay',
                'departure_location' => 'TP.HCM',
                'description' => 'Khám phá Đà Nẵng - Hội An và siêu phẩm Cầu Vàng tại Bà Nà Hills.',
                'content' => 'Hành trình đưa quý khách đến với thành phố đáng sống nhất Việt Nam. Trải nghiệm cáp treo đạt nhiều kỷ lục thế giới tại Bà Nà, check-in Cầu Vàng, tham quan Ngũ Hành Sơn hùng vĩ và dạo bước phố cổ Hội An lung linh về đêm.',
                'combo_content' => 'Vé máy bay khứ hồi, Khách sạn 4 sao gần biển, 02 bữa sáng buffet, Vé cáp treo Bà Nà Hills, Xe đưa đón đời mới.',
                'image_url' => 'https://hoangphuan.com/wp-content/uploads/2024/06/tour-du-lich-da-nang-1.jpg',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 3,
                'name' => 'Tour Hà Nội: Hào khí Thăng Long',
                'days' => 2,
                'transport' => 'Xe khách',
                'departure_location' => 'Hải Phòng',
                'description' => 'Tham quan thủ đô nghìn năm văn hiến và thưởng thức ẩm thực Hà thành.',
                'content' => 'Khám phá những địa danh lịch sử như Lăng Bác, Văn Miếu Quốc Tử Giám, dạo quanh 36 phố cổ bằng xích lô. Thưởng thức đặc sản bún chả, phở Hà Nội và xem show múa rối nước đặc sắc.',
                'combo_content' => 'Xe Limousine đưa đón, Khách sạn trung tâm phố cổ, 01 bữa tối đặc sản, Hướng dẫn viên suốt tuyến.',
                'image_url' => 'https://travel-bus-files.s3.ap-southeast-1.amazonaws.com/images/9558e8f5-7dc4-4b7a-9b3c-a1e7b4cdedb0.jpeg',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 9,
                'name' => 'Tour Bangkok - Pattaya: Xứ sở Chùa Vàng',
                'days' => 4,
                'transport' => 'Máy bay',
                'departure_location' => 'TP.HCM',
                'description' => 'Du lịch Thái Lan hấp dẫn với các show diễn hoành tráng và thiên đường mua sắm.',
                'content' => 'Hành trình từ thủ đô Bangkok náo nhiệt đến thành phố biển Pattaya không ngủ. Tham quan Chùa Phật Ngọc, Cung điện Hoàng Gia, dạo thuyền trên sông Chao Phraya và xem show Alcazar hoành tráng.',
                'combo_content' => 'Vé máy bay khứ hồi, Khách sạn 4-5 sao, Buffet tối tại tòa nhà 84 tầng Baiyoke Sky, Bảo hiểm du lịch quốc tế.',
                'image_url' => 'https://vietlandtravel.vn/upload/img/products/27122025/bangkok-pattaya.png',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 32,
                'name' => 'Tour Singapore: Đảo quốc Sư Tử',
                'days' => 3,
                'transport' => 'Máy bay',
                'departure_location' => 'TP.HCM',
                'description' => 'Khám phá quốc đảo Singapore hiện đại và xanh mát bậc nhất thế giới.',
                'content' => 'Trải nghiệm Gardens by the Bay với hệ thống siêu cây, vui chơi tại Universal Studios, xem show nhạc nước Spectra Light hoành tráng và mua sắm thả ga tại Orchard Road.',
                'combo_content' => 'Vé máy bay, Khách sạn gần trung tâm, Vé vào cổng các điểm tham quan theo chương trình, Sim 4G Singapore.',
                'image_url' => 'https://havatravel.vn/upload/hinhthem/imagedulichsingaporevoinhungdiemthamquanvuichoimienphi165237552751402-8243.jpeg',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 21,
                'name' => 'Tour Bali: Thiên đường nhiệt đới',
                'days' => 5,
                'transport' => 'Máy bay',
                'departure_location' => 'TP.HCM',
                'description' => 'Nghỉ dưỡng tại hòn đảo xinh đẹp Bali với những bãi biển xanh ngắt.',
                'content' => 'Check-in cổng trời Lempuyang, trải nghiệm Bali Swing ngắm nhìn ruộng bậc thang Tegalalang, tham quan đền Tanah Lot trên biển và tận hưởng những bữa tối hải sản dưới ánh hoàng hôn tại vịnh Jimbaran.',
                'combo_content' => 'Vé máy bay khứ hồi, Resort có hồ bơi cực chill, Xe riêng tham quan suốt hành trình, 01 bữa tối lãng mạn trên bãi biển.',
                'image_url' => 'https://toptentravel.com.vn/Data/Sites/1/News/4528/kham-pha-bali-thien-duong-du-lich-nhiet-doi-cua-indonesia-2.png',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 25,
                'name' => 'Tour Tokyo: Hiện đại và Truyền thống',
                'days' => 4,
                'transport' => 'Máy bay',
                'departure_location' => 'Hà Nội',
                'description' => 'Khám phá Tokyo sầm uất và biểu tượng Núi Phú Sĩ hùng vĩ.',
                'content' => 'Tham quan đền Senso-ji cổ kính, cung điện hoàng gia, trải nghiệm mua sắm tại Shibuya. Đặc biệt là hành trình chiêm ngưỡng núi Phú Sĩ và làng cổ Oshino Hakkai dưới chân núi.',
                'combo_content' => 'Visa Nhật Bản, Khách sạn tiêu chuẩn Nhật, Vé tàu điện ngầm trải nghiệm, Bữa tối với lẩu Shabu Shabu.',
                'image_url' => 'https://bizweb.dktcdn.net/100/514/927/files/khi-anh-den-chua-bao-gio-tat-tai-shibuya-1682866202-7d6ef46b-0a18-4d90-b5b3-73c63c8f52b5.jpg?v=1756891289107',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 39,
                'name' => 'Tour Seoul - Nami: Bản tình ca mùa đông',
                'days' => 4,
                'transport' => 'Máy bay',
                'departure_location' => 'Hà Nội',
                'description' => 'Du lịch Hàn Quốc lãng mạn tại đảo Nami và cung điện cổ Seoul.',
                'content' => 'Khám phá cung điện Gyeongbokgung, làng Bukchon Hanok, vui chơi tại công viên Everland và dạo bước trên con đường rợp bóng cây tại đảo Nami thơ mộng.',
                'combo_content' => 'Visa Hàn Quốc, Khách sạn 4 sao, Lớp học làm Kimchi và mặc Hanbok, Vé vào cổng các khu vui chơi.',
                'image_url' => 'https://booking.dulichthiennhien.vn/Data/image/TIN%20T%E1%BB%A8C%20DU%20L%E1%BB%8ACH/92/nami-island-winter.jpg',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 35,
                'name' => 'Tour Bắc Kinh: Vẻ đẹp vĩnh cửu',
                'days' => 5,
                'transport' => 'Máy bay',
                'departure_location' => 'TP.HCM',
                'description' => 'Tham quan Vạn Lý Trường Thành và các di tích lịch sử Trung Hoa.',
                'content' => 'Chinh phục Vạn Lý Trường Thành, khám phá Tử Cấm Thành uy nghi, tham quan Di Hòa Viên - vườn hoa hoàng gia lớn nhất thế giới và thưởng thức món vịt quay Bắc Kinh trứ danh.',
                'combo_content' => 'Visa đoàn Trung Quốc, Khách sạn 4 sao quốc tế, 01 bữa vịt quay Bắc Kinh, Xe đưa đón chất lượng cao.',
                'image_url' => 'https://thaiantravel.com/wp-content/uploads/2024/06/di-hoa-vien-trung-quoc-thaiantravel-4-jpg.webp',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 15,
                'name' => 'Tour Lào: Đất nước Triệu Voi',
                'days' => 3,
                'transport' => 'Xe khách',
                'departure_location' => 'Nghệ An',
                'description' => 'Khám phá vẻ đẹp yên bình của Luang Prabang và Viêng Chăn.',
                'content' => 'Tham quan thác Kuang Si xanh ngọc, tham gia lễ khất thực mỗi sáng, khám phá cố đô cổ kính và chùa vàng Pha That Luang biểu tượng quốc gia.',
                'combo_content' => 'Xe giường nằm cao cấp, Khách sạn tiêu chuẩn, Các bữa ăn theo thực đơn địa phương, Bảo hiểm du lịch.',
                'image_url' => 'https://cdn3.ivivu.com/2024/12/tour-Lao-5N4D-ivivu-9.png',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 18,
                'name' => 'Tour Campuchia: Bí ẩn Angkor',
                'days' => 3,
                'transport' => 'Xe khách',
                'departure_location' => 'TP.HCM',
                'description' => 'Hành trình về miền đất hứa Angkor Wat và Angkor Thom.',
                'content' => 'Khám phá kỳ quan thế giới Angkor Wat, đền Ta Prohm với những bộ rễ cây cổ thụ khổng lồ, chinh phục đỉnh đồi Bakheng ngắm hoàng hôn rực rỡ.',
                'combo_content' => 'Xe vận chuyển xuyên biên giới, Khách sạn có hồ bơi, Buffet tối với điệu múa Apsara truyền thống, Lệ phí cửa khẩu.',
                'image_url' => 'https://puolotrip.com/images/pro/package-tour-campuchia-4n3d--aCtV_1630.jpg',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'location_id' => 6,
                'name' => 'Tour Vịnh Hạ Long: Du thuyền giữa Kỳ Quan',
                'days' => 2,
                'transport' => 'Xe du lịch',
                'departure_location' => 'Hà Nội',
                'description' => 'Trải nghiệm ngủ đêm trên du thuyền 5 sao và khám phá hàng ngàn đảo đá vôi kỳ vĩ.',
                'content' => 'Hành trình đưa quý khách len lỏi giữa các hòn đảo đá vôi kỳ ảo trên vịnh Hạ Long. Quý khách sẽ được tham quan Hang Sửng Sốt - hang động lớn nhất vịnh, chèo thuyền Kayak tại Hang Luồn và tắm biển tại đảo Titop. Buổi tối là thời gian tuyệt vời để thưởng thức tiệc Sunset Party và câu mực ngay trên boong tàu.',
                'combo_content' => 'Xe đưa đón Hà Nội - Hạ Long cao cấp, 01 đêm nghỉ tại cabin du thuyền hạng sang, 03 bữa ăn chính với hải sản tươi sống, Vé tham quan các điểm trong chương trình, Hướng dẫn viên tiếng Anh/Việt.',
                'image_url' => 'https://halongbay.com.vn/Data/files/B%E1%BB%A9c%20tranh%20thu%E1%BB%B7%20m%E1%BA%B7c%204_Nh%C3%A2n%20d%C3%A2n.png',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}