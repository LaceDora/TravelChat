import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../service/api";

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const pageSize = 5;

  const formatDateTime = (value?: string) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContinuePayment = (booking: any) => {
    const params = new URLSearchParams({
      bookingId: String(booking.id),
      price: String(booking.total_amount ?? 0),
      people: String(booking.quantity ?? 1),
      date: String(booking.booking_date ?? ""),
    });

    if (booking.booking_type === "tour") {
      params.set("tourId", String(booking.target_id ?? ""));
    } else {
      params.set("serviceType", String(booking.booking_type ?? ""));
      params.set("serviceId", String(booking.target_id ?? ""));
    }

    navigate(`/payment?${params.toString()}`);
  };

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: any = {
    pending: "Chờ thanh toán",
    confirmed: "Đã xác nhận",
    paid: "Đã thanh toán",
    cancelled: "Đã hủy",
  };

  const handleCancel = async (bookingId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm("Bạn chắc chắn muốn hủy booking này?")) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      setCancellingId(bookingId);
      const data = await apiPost<any>(
        `/bookings/${bookingId}/cancel?user_id=${user.id}`,
        {},
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? data.booking || b : b)),
      );
      alert("Đã hủy booking thành công");
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(stored);
    apiGet<any>(`/my-bookings?user_id=${user.id}`)
      .then((data) => {
        console.log("[BookingHistory] API response:", data);
        setBookings(data.data ?? data);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / pageSize);
  const pagedBookings = bookings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đặt của bạn</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đặt chỗ nào.</p>
      ) : (
        <>
          <div className="space-y-4">
            {pagedBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {b.tour?.name || b.title || b.item_name || b.booking_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ngày sử dụng: {formatDateTime(b.booking_date || b.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Đặt lúc: {formatDateTime(b.created_at)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {b.quantity ?? b.people ?? "-"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    {b.total_amount
                      ? Number(b.total_amount).toLocaleString() + " VND"
                      : "-"}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${statusColors[b.status] || "bg-gray-100"}`}
                  >
                    {statusLabels[b.status] || b.status}
                  </span>
                  <div className="flex gap-2 mt-2">
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleContinuePayment(b)}
                        className="flex-1 px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                        disabled={cancellingId === b.id}
                      >
                        Thanh toán
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/bookings/${b.id}`)}
                      className="flex-1 px-3 py-1 border rounded text-sm hover:bg-blue-50"
                    >
                      Xem chi tiết
                    </button>
                    {b.status === "pending" && (
                      <button
                        onClick={(e) => handleCancel(b.id, e)}
                        disabled={cancellingId === b.id}
                        className={`flex-1 px-3 py-1 border rounded text-sm ${
                          cancellingId === b.id
                            ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                            : "border-red-300 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {cancellingId === b.id ? "Đang hủy..." : "Hủy"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded border ${page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}
              >
                &lt;
              </button>
              <span className="px-2 text-sm font-semibold">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded border ${page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
