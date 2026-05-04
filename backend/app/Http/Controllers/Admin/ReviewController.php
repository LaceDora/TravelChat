<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Hotel;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá cho Admin
     */
    public function index(Request $request)
    {
        $query = Review::with(['user:id,name,avatar_url', 'reviewable']);

        if ($request->type) {
            $modelClass = match ($request->type) {
                'tour' => Tour::class,
                'hotel' => Hotel::class,
                'restaurant' => Restaurant::class,
                default => null,
            };
            if ($modelClass) {
                $query->where('reviewable_type', $modelClass);
            }
        }

        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        $reviews = $query->orderBy('created_at', 'desc')->get();

        $reviews->transform(function ($review) {
            $review->entity_name = $review->reviewable ? $review->reviewable->name : 'N/A';
            
            $review->entity_type = match ($review->reviewable_type) {
                Tour::class => 'tour',
                Hotel::class => 'hotel',
                Restaurant::class => 'restaurant',
                default => 'unknown',
            };
            return $review;
        });

        return response()->json($reviews);
    }

    /**
     * Chuyển trạng thái sang HIỂN THỊ
     */
    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => true]);

        $this->recalcRating($review->reviewable_type, $review->reviewable_id);

        return response()->json(['message' => 'Bình luận đã được hiển thị']);
    }

    /**
     * Chuyển trạng thái sang ẨN
     */
    public function reject($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => false]);

        $this->recalcRating($review->reviewable_type, $review->reviewable_id);

        return response()->json(['message' => 'Bình luận đã được ẩn']);
    }

    /**
     * Xóa vĩnh viễn đánh giá
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $type = $review->reviewable_type;
        $entityId = $review->reviewable_id;

        $review->delete();

        $this->recalcRating($type, $entityId);

        return response()->json(['message' => 'Bình luận đã được xóa vĩnh viễn']);
    }

    /**
     * Tính toán lại điểm và số lượng bình luận
     */
    private function recalcRating($modelClass, $entityId)
    {
        $entity = $modelClass::find($entityId);
        if (!$entity) return;

        // Lấy thống kê từ những bình luận ĐANG HIỂN THỊ
        $stats = Review::where('reviewable_type', $modelClass)
            ->where('reviewable_id', $entityId)
            ->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        $count = $stats->total ?? 0;
        
        // Dữ liệu cập nhật mặc định (số lượng bình luận)
        $updateData = ['reviews_count' => $count];

        // Nếu KHÔNG PHẢI là Tour thì mới tính điểm trung bình và nhãn rating
        if ($modelClass !== Tour::class) {
            $avg = round($stats->avg_rating ?? 0, 1);
            $ratingText = match (true) {
                $avg >= 4.5 => 'Tuyệt vời',
                $avg >= 4.0 => 'Rất tốt',
                $avg >= 3.5 => 'Tốt',
                $avg >= 3.0 => 'Khá',
                $avg >= 2.0 => 'Trung bình',
                default     => 'Chưa có đánh giá',
            };

            $updateData['rating'] = $avg;
            $updateData['rating_text'] = $ratingText;
        }

        // Cập nhật vào Model tương ứng
        $entity->update($updateData);
    }
}