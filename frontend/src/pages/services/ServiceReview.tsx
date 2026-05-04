import React, { useState, useEffect } from "react";
import { MessageSquare, AlertCircle, Loader2, Star, User } from "lucide-react";

interface Review {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
}

interface ServiceReviewProps {
  serviceId: number;
  type: "hotel" | "restaurant";
  onReviewSuccess?: () => void;
}

const ServiceReview: React.FC<ServiceReviewProps> = ({
  serviceId,
  type,
  onReviewSuccess,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0); // Mặc định chưa chọn sao nào
  const [hover, setHover] = useState(0); // Hiệu ứng hover như Play Store
  const [serverError, setServerError] = useState<string | null>(null);

  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reviews?type=${type}&id=${serviceId}`,
      );
      const data = await response.json();
      setReviews(data.data || data);
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [serviceId, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setServerError("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: type,
          id: serviceId,
          comment: comment,
          rating: rating,
        }),
      });

      if (response.ok) {
        setComment("");
        setRating(0);
        loadReviews();
        if (onReviewSuccess) onReviewSuccess();
      } else {
        const result = await response.json();
        setServerError(result.message || "Không thể gửi đánh giá.");
      }
    } catch (error) {
      setServerError("Lỗi kết nối máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto my-10 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <MessageSquare className="text-amber-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Đánh giá từ cộng đồng ({reviews.length})
          </h3>
        </div>
      </div>

      {/* --- FORM ĐÁNH GIÁ KIỂU PLAY STORE --- */}
      {isLoggedIn ? (
        <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-center text-gray-600 mb-4 font-medium">
            Bạn thấy dịch vụ này thế nào?
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Picker */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="transition-transform active:scale-90"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    size={36}
                    fill={(hover || rating) >= star ? "#fbbf24" : "none"}
                    color={(hover || rating) >= star ? "#fbbf24" : "#d1d5db"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
              rows={3}
            />

            {serverError && (
              <div className="flex items-center gap-2 text-red-500 text-sm animate-pulse">
                <AlertCircle size={16} /> {serverError}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Gửi đánh giá ngay"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-10 p-6 bg-blue-50 rounded-2xl text-center border border-blue-100">
          <p className="text-blue-700">
            Hãy{" "}
            <a href="/login" className="font-bold underline">
              đăng nhập
            </a>{" "}
            để chia sẻ đánh giá của bạn.
          </p>
        </div>
      )}

      {/* --- DANH SÁCH BÌNH LUẬN --- */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.user.avatar_url ? (
                  <img
                    src={item.user.avatar_url}
                    alt={item.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800">{item.user.name}</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Hiển thị số sao của user đó */}
                <div className="flex gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < item.rating ? "#fbbf24" : "none"}
                      color={i < item.rating ? "#fbbf24" : "#d1d5db"}
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed text-sm mt-2">
                  {item.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceReview;
