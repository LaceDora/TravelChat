import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../service/api";

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

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

    const res = await fetch(
      `/api/bookings/${bookingId}/cancel?user_id=${user.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    if (res.ok) {
      // Cập nhật state
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      alert("Đã hủy booking thành công");
    } else {
      const data = await res.json();
      alert("Lỗi: " + data.message);
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
                    {b.tour?.departures?.[0]?.departure_date
                      ? new Date(
                          b.tour.departures[0].departure_date,
                        ).toLocaleString()
                      : new Date(
                          b.booking_date || b.date || b.created_at,
                        ).toLocaleString()}
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
                    <button
                      onClick={() => navigate(`/bookings/${b.id}`)}
                      className="flex-1 px-3 py-1 border rounded text-sm hover:bg-blue-50"
                    >
                      Xem chi tiết
                    </button>
                    {b.status === "pending" && (
                      <button
                        onClick={(e) => handleCancel(b.id, e)}
                        className="flex-1 px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
                      >
                        Hủy
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
