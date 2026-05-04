const API_URL = "http://localhost:8000/api/admin/reviews";

export interface Review {
  id: number;
  user_id: number;
  reviewable_type: string; // Lưu class model: App\Models\Tour, App\Models\Hotel...
  reviewable_id: number; // ID của đối tượng được đánh giá
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
  // Nếu Backend có trả về thêm thông tin đối tượng thông qua Eager Loading
  reviewable?: {
    id: number;
    name?: string;
    title?: string;
  };
}

/**
 * Lấy danh sách đánh giá
 * @param type: Truyền vào reviewable_type (VD: App\Models\Tour) để lọc
 */
export const getReviews = async (type?: string): Promise<Review[]> => {
  // Sử dụng URLSearchParams để build query string chuẩn hơn
  const url = new URL(API_URL);
  if (type) url.searchParams.append("reviewable_type", type);

  const res = await fetch(url.toString());
  if (!res.ok)
    throw new Error("Không thể kết nối máy chủ để lấy danh sách đánh giá");
  return res.json();
};

/**
 * Duyệt đánh giá (Chuyển is_approved thành true)
 */
export const approveReview = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Cập nhật duyệt đánh giá thất bại");
  return res.json();
};

/**
 * Từ chối/Bỏ duyệt đánh giá (Chuyển is_approved thành false)
 */
export const rejectReview = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Hủy trạng thái duyệt thất bại");
  return res.json();
};

/**
 * Xóa vĩnh viễn đánh giá
 */
export const deleteReview = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa đánh giá thất bại");
  return res.json();
};
