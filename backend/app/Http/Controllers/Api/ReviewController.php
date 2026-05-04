<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Hotel;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Xác định Model dựa trên loại dịch vụ
     */
    private function getModelClass(string $type): ?string
    {
        return match ($type) {
            'tour'       => Tour::class,
            'hotel'      => Hotel::class,
            'restaurant' => Restaurant::class,
            default      => null,
        };
    }

    /**
     * Lấy danh sách bình luận (Chỉ lấy những cái đã được duyệt/hiện)
     */
    public function index(Request $request)
    {
        $request->validate([
            'type' => 'required|in:tour,hotel,restaurant',
            'id'   => 'required|integer',
        ]);

        $modelClass = $this->getModelClass($request->type);

        $reviews = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $request->id)
            ->where('is_approved', true) // <--- QUAN TRỌNG: Chỉ lấy bình luận đang hiện
            ->with('user:id,name,avatar_url')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Gửi bình luận mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'type'    => 'required|in:tour,hotel,restaurant',
            'id'      => 'required|integer',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Bạn cần đăng nhập để bình luận'], 401);
        }

        $modelClass = $this->getModelClass($request->type);
        $entity = $modelClass::find($request->id);

        if (!$entity) {
            return response()->json(['message' => 'Đối tượng không tồn tại'], 404);
        }

        // Tạo hoặc cập nhật review của User cho đối tượng này
        $review = Review::updateOrCreate(
            [
                'user_id'         => $userId,
                'reviewable_type' => $modelClass,
                'reviewable_id'   => $request->id,
            ],
            [
                'rating'      => $request->rating,
                'comment'     => $request->comment,
                'is_approved' => true, // Mặc định cho hiện luôn, hoặc để false nếu muốn Admin duyệt trước
            ]
        );

        // Cập nhật lại điểm trung bình cho Tour/Hotel/Restaurant
        $this->updateEntityRating($entity);

        return response()->json([
            'message' => 'Đánh giá thành công',
            'data'    => $review->load('user:id,name,avatar_url')
        ], 201);
    }

    /**
     * Tính toán lại điểm trung bình và số lượng review
     */
    private function updateEntityRating($entity)
    {
        $modelClass = get_class($entity);
        
        $stats = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $entity->id)
            ->where('is_approved', true) // Chỉ tính điểm dựa trên bình luận đang hiển thị
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        $count = $stats->total ?? 0;
        $updateData = ['reviews_count' => $count];

        // Nếu không phải là Tour (Hotel/Restaurant cần điểm rating)
        if ($modelClass !== Tour::class) {
            $avg = round($stats->avg_rating ?? 0, 1);
            $updateData['rating'] = $avg;
            $updateData['rating_text'] = match (true) {
                $avg >= 4.5 => 'Tuyệt vời',
                $avg >= 4.0 => 'Rất tốt',
                $avg >= 3.5 => 'Tốt',
                $avg >= 3.0 => 'Khá',
                $avg >= 2.0 => 'Trung bình',
                default     => 'Chưa đánh giá',
            };
        }

        $entity->update($updateData);
    }

    /**
     * Kiểm tra quyền review cho Frontend
     */
    public function canReview(Request $request)
    {
        $request->validate([
            'type' => 'required|in:tour,hotel,restaurant',
            'id'   => 'required|integer',
        ]);

        $userId = auth()->id();
        if (!$userId) return response()->json(['can_review' => false, 'reason' => 'unauthorized']);

        return response()->json([
            'can_review'   => true, 
            'has_reviewed' => Review::where('user_id', $userId)
                                ->where('reviewable_type', $this->getModelClass($request->type))
                                ->where('reviewable_id', $request->id)
                                ->exists(),
        ]);
    }
}