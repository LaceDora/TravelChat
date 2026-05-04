import React, { useState, useEffect } from "react";
import { MessageSquare, Send, AlertCircle, Loader2, User } from "lucide-react";

interface Review {
  id: number;
  comment: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
}

interface TourReviewProps {
  tourId: number;
}

const TourReview: React.FC<TourReviewProps> = ({ tourId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  // --- KIỂM TRA TOKEN ---
  // Thử lấy token với các tên phổ biến, bạn hãy kiểm tra trong Application -> Local Storage xem web của bạn lưu tên là gì nhé
  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  const loadTourData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reviews?type=tour&id=${tourId}`,
      );
      const data = await response.json();
      setReviews(data.data || data);
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTourData();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Gửi Token lên để xác thực
        },
        body: JSON.stringify({
          type: "tour",
          id: tourId,
          comment: comment,
          rating: 5,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setComment("");
        loadTourData();
      } else {
        // Nếu backend trả về 403, nghĩa là backend vẫn đang chặn "Chưa mua tour"
        if (response.status === 403) {
          setServerError(
            "Lỗi: Backend vẫn đang yêu cầu phải mua tour mới được bình luận.",
          );
        } else if (response.status === 401) {
          setServerError("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
        } else {
          setServerError(result.message || "Không thể gửi bình luận.");
        }
      }
    } catch (error) {
      setServerError("Lỗi kết nối Server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-5">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto my-10 border-t pt-10">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-emerald-600" />
        <h3 className="text-2xl font-bold">Bình luận ({reviews.length})</h3>
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-6 mb-10">
        {reviews.map((item) => (
          <div key={item.id} className="flex gap-4 border-b pb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
              {item.user.avatar_url ? (
                <img src={item.user.avatar_url} />
              ) : (
                item.user.name.charAt(0)
              )}
            </div>
            <div>
              <h4 className="font-bold">{item.user.name}</h4>
              <p className="text-gray-600">{item.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form viết bình luận */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500"
            placeholder="Viết bình luận..."
            rows={3}
          />
          {serverError && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Send size={18} /> Gửi bình luận
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
          Vui lòng{" "}
          <a href="/login" className="underline font-bold">
            đăng nhập
          </a>{" "}
          để tham gia bình luận.
        </div>
      )}
    </div>
  );
};

export default TourReview;
