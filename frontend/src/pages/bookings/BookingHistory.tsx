import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      `http://127.0.0.1:8000/api/bookings/${bookingId}/cancel?user_id=${user.id}`,
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
    fetch(`http://127.0.0.1:8000/api/my-bookings?user_id=${user.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBookings(data.data ?? data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đặt của bạn</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đặt chỗ nào.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-white border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {b.title || b.item_name || b.booking_type}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(
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
      )}
    </div>
  );
}
