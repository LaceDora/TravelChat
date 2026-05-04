import { useEffect, useState } from "react";
import {
  Star,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  getReviews,
  approveReview,
  rejectReview,
  deleteReview,
  Review,
} from "../../services/ReviewService";

const typeLabels: Record<string, string> = {
  tour: "Tour",
  "App\\Models\\Tour": "Tour",
  hotel: "Khách sạn",
  "App\\Models\\Hotel": "Khách sạn",
  restaurant: "Nhà hàng",
  "App\\Models\\Restaurant": "Nhà hàng",
};

const typeBadgeColor: Record<string, string> = {
  tour: "bg-orange-100 text-orange-700",
  "App\\Models\\Tour": "bg-orange-100 text-orange-700",
  hotel: "bg-emerald-100 text-emerald-700",
  "App\\Models\\Hotel": "bg-emerald-100 text-emerald-700",
  restaurant: "bg-rose-100 text-rose-700",
  "App\\Models\\Restaurant": "bg-rose-100 text-rose-700",
};

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(filter || undefined);
      setReviews(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await rejectReview(id); // Chuyển thành Ẩn
      } else {
        await approveReview(id); // Chuyển thành Hiện
      }
      fetchReviews();
    } catch (err) {
      alert("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này?")) return;
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (err) {
      alert("Lỗi khi xóa đánh giá");
    }
  };

  const renderStars = (rating: number, type: string) => {
    // Không hiển thị sao cho Tour
    if (type && type.toLowerCase().includes("tour")) {
      return <span className="text-gray-300 italic">---</span>;
    }

    return (
      <div className="flex justify-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Bình luận
            </h1>
            <p className="text-xs text-gray-400">
              {reviews.length} lượt phản hồi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Tất cả loại hình</option>
            <option value="tour">Tour</option>
            <option value="hotel">Khách sạn</option>
            <option value="restaurant">Nhà hàng</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b">
                <th className="px-5 py-4 text-left font-bold">Khách hàng</th>
                <th className="px-5 py-4 text-left font-bold">Phân loại</th>
                <th className="px-5 py-4 text-center font-bold">
                  Đánh giá sao
                </th>
                <th className="px-5 py-4 text-left font-bold">Nội dung</th>
                <th className="px-5 py-4 text-center font-bold">Trạng thái</th>
                <th className="px-5 py-4 text-center font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    Không có đánh giá nào phù hợp.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-700">
                        {r.user?.name || `User #${r.user_id}`}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${typeBadgeColor[r.reviewable_type] || "bg-gray-100 text-gray-600"}`}
                      >
                        {typeLabels[r.reviewable_type] || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {renderStars(r.rating, r.reviewable_type)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <div
                        className="max-w-xs truncate"
                        title={r.comment || ""}
                      >
                        {r.comment || (
                          <span className="italic text-gray-300">Trống</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {r.is_approved ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-600">
                          Đang hiện
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-400">
                          Đang ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() =>
                            handleToggleStatus(r.id, !!r.is_approved)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            r.is_approved
                              ? "hover:bg-amber-50 text-amber-600"
                              : "hover:bg-emerald-50 text-emerald-600"
                          }`}
                          title={
                            r.is_approved ? "Ẩn bình luận" : "Hiện bình luận"
                          }
                        >
                          {r.is_approved ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
