<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('blogs')->insert([
            [
                'title' => 'Top 5 địa điểm không thể bỏ qua khi đến Đà Nẵng mùa hè này',
                'content' => "Đà Nẵng, thành phố của những cây cầu, luôn biết cách làm say lòng du khách mỗi khi hè về. Nếu bạn đang lên kế hoạch cho chuyến đi sắp tới, đừng bỏ qua 5 tọa độ \"vàng\" sau đây.\n\n1. Bà Nà Hills: Không chỉ là một khu vui chơi, đây là nơi bạn có thể trải nghiệm thời tiết 4 mùa trong một ngày và check-in tại Cầu Vàng - biểu tượng du lịch thế giới.\n2. Bãi biển Mỹ Khê: Từng được tạp chí Forbes vinh danh là một trong những bãi biển quyến rũ nhất hành tinh với bãi cát trắng mịn và làn nước ấm.\n3. Bán đảo Sơn Trà: Nơi có chùa Linh Ứng với tượng Phật Bà cao nhất Việt Nam, sở hữu tầm nhìn ôm trọn vịnh Đà Nẵng.\n4. Ngũ Hành Sơn: Quần thể gồm 5 ngọn núi đá vôi hội tụ vẻ đẹp của tâm linh và thiên nhiên kỳ bí.\n5. Phố cổ Hội An: Dù cách trung tâm 30km, nhưng vẻ đẹp lung linh của đèn lồng về đêm là trải nghiệm khó quên.",
                'cover_url' => 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_12587/12587.png?version=072313',
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Kinh nghiệm du lịch Thái Lan tự túc từ A đến Z cho người mới',
                'content' => "Du lịch Thái Lan tự túc chưa bao giờ hết hot, nhưng với người đi lần đầu, sự chuẩn bị kỹ lưỡng là chìa khóa cho một chuyến đi suôn sẻ.\n\nVề thủ tục: Người Việt Nam được miễn visa, bạn chỉ cần hộ chiếu còn hạn trên 6 tháng.\nVề di chuyển: Hãy cài đặt ứng dụng Grab hoặc Bolt để biết trước giá xe. Đừng quên thử cảm giác đi tàu điện BTS xuyên qua các tòa nhà cao tầng hay ngồi thuyền trên sông Chao Phraya.\nVề ẩm thực: Hãy dành ít nhất một buổi tối tại các chợ đêm như Jodd Fairs để thưởng thức sườn núi lửa, xôi xoài và trà sữa Thái chính gốc.\nVề mua sắm: Central World hay Siam Paragon là thiên đường cho các tín đồ hàng hiệu, trong khi chợ Chatuchak là nơi lý tưởng để mua đồ thủ công mỹ nghệ giá rẻ.\n\nMột lưu ý quan trọng: Luôn mang theo một chiếc khăn choàng hoặc áo có tay khi vào tham quan cung điện để tránh bị từ chối vào cổng.",
                'cover_url' => 'https://egoexpress.vn/wp-content/uploads/2021/12/Thai-Lan.jpg',
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long trên du thuyền 5 sao',
                'content' => "Vịnh Hạ Long không chỉ là di sản, đó là một tác phẩm nghệ thuật của tạo hóa. Và cách tuyệt vời nhất để tận hưởng tác phẩm đó là lênh đênh trên một chiếc du thuyền 5 sao.\n\nTrải nghiệm khác biệt: Thay vì vội vã trong những chuyến tàu tiếng, bạn sẽ có trọn vẹn 24h hoặc 48h giữa lòng vịnh. Buổi sáng, bạn có thể tham gia lớp học Thái Cực Quyền trên boong tàu. Buổi chiều là thời gian cho những hoạt động năng động như chèo thuyền Kayak xuyên qua các hang luồn, tắm biển tại đảo Titop hoặc tham quan hang Sửng Sốt.\n\nDịch vụ đẳng cấp: Các du thuyền hiện nay như một khách sạn di động với đầy đủ spa, hồ bơi vô cực và nhà hàng sang trọng. Thưởng thức bữa tối dưới ánh nến giữa không gian tĩnh lặng của biển cả chắc chắn là kỉ niệm lãng mạn nhất.",
                'cover_url' => 'https://storage.googleapis.com/blogvxr-uploads/2025/05/77b57b55-dia-diem-du-lich-ha-long-6708449.jpg',
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Mùa hoa anh đào Nhật Bản: Thời điểm và những địa điểm ngắm hoa đẹp nhất',
                'content' => "Mùa hoa anh đào (Sakura) là thời điểm Nhật Bản khoác lên mình chiếc áo màu hồng nhạt tinh khôi.\n\nThời điểm lý tưởng: Hoa thường nở rộ từ cuối tháng 3 tại Tokyo và muộn dần về phía Bắc như Hokkaido. Tuy nhiên, thời gian hoa nở rộ (Full bloom) chỉ kéo dài khoảng 1 tuần.\nĐịa điểm gợi ý: Tại Tokyo, công viên Shinjuku Gyoen là nơi bình yên để tổ chức tiệc Hanami. Tại Kyoto, hãy đi dọc \"Con đường Triết gia\". Nếu muốn một góc nhìn hùng vĩ, khu vực Ngũ Hồ dưới chân núi Phú Sĩ là sự kết hợp hoàn hảo.\n\nLời khuyên: Đây là mùa du lịch cao điểm nhất năm, hãy đặt trước ít nhất 4-5 tháng.",
                'cover_url' => 'https://res.cloudinary.com/enchanting/q_70,f_auto,c_fill,g_face/hj-web/2020/12/Young-Japanese-woman-in-a-traditional-Kimono-dress-at-Kiyomizu-dera-temple-in-Kyoto-Japan.jpg',
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Gợi ý lịch trình 4 ngày 3 đêm khám phá Seoul cực chất',
                'content' => "Seoul là một thành phố không ngủ, nơi bạn có thể tìm thấy những cung điện cổ xưa nằm ngay cạnh những tòa nhà chọc trời.\n\nNgày 1: Thuê một bộ Hanbok và ghé thăm cung điện Gyeongbokgung để được miễn phí vé vào cổng.\nNgày 2: Ghé thăm khu phố Myeongdong để mua mỹ phẩm, sau đó qua Dongdaemun Design Plaza.\nNgày 3: Dành trọn một ngày tại đảo Nami lãng mạn.\nNgày 4: Kết thúc hành trình tại tháp Namsan, treo khóa tình yêu và ngắm nhìn toàn cảnh Seoul.\n\nĐừng quên mua một chiếc thẻ T-Money ngay tại sân bay để việc đi lại trở nên dễ dàng hơn!",
                'cover_url' => 'https://duhoc.thanhgiang.com.vn/wp-content/uploads/han-quoc-ngay-nay.jpg',
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}