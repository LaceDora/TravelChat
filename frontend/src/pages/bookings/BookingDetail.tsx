import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch(`http://127.0.0.1:8000/api/bookings/${id}?user_id=${user.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = () => {
    if (!booking) return;

    // Chuyển đến trang thanh toán
    navigate(
      `/payment?bookingId=${booking.id}&tourId=${booking.target_id}&price=${
        booking.total_amount || 0
      }&people=${booking.quantity || 1}&date=${booking.booking_date}`,
    );
  };

  const handleCancel = async () => {
    if (!window.confirm("Bạn chắc chắn muốn hủy booking này?")) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(
      `http://127.0.0.1:8000/api/bookings/${id}/cancel?user_id=${user.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    const data = await res.json();

    if (res.ok) {
      alert("Đã hủy booking thành công");
      setBooking(data.booking);
    } else {
      alert("Lỗi: " + data.message);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  if (!booking)
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Không tìm thấy booking</p>
        <button
          onClick={() => navigate("/bookings")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Quay lại
        </button>
      </div>
    );

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

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Chi tiết booking
        </h1>
        <p className="text-gray-600">ID: {booking.id}</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              statusColors[booking.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusLabels[booking.status] || booking.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Loại đặt</p>
              <p className="text-lg font-semibold text-gray-800">
                {booking.booking_type === "tour"
                  ? "Tour"
                  : booking.booking_type === "hotel"
                    ? "Khách sạn"
                    : "Nhà hàng"}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Ngày đặt</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(booking.booking_date).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Số lượng</p>
              <p className="text-lg font-semibold text-gray-800">
                {booking.quantity || 1}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">ID dịch vụ</p>
              <p className="text-lg font-semibold text-gray-800">
                {booking.target_id}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Ngày tạo</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(booking.created_at).toLocaleString("vi-VN")}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Loại thanh toán</p>
              <p className="text-lg font-semibold text-gray-800">
                {booking.payment_type || "deposit"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Tổng tiền:</span>
            <span className="text-3xl font-bold text-blue-600">
              {booking.total_amount
                ? Number(booking.total_amount).toLocaleString()
                : "0"}{" "}
              VND
            </span>
          </div>
        </div>

        {/* Note */}
        {booking.note && (
          <div className="mb-8">
            <p className="text-gray-600 text-sm mb-2">Ghi chú</p>
            <p className="text-gray-700 bg-gray-50 p-4 rounded">
              {booking.note}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {booking.status === "pending" && (
            <>
              <button
                onClick={handlePayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                💳 Thanh toán ngay
              </button>

              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
              >
                ❌ Hủy booking
              </button>
            </>
          )}

          {booking.status === "cancelled" && (
            <div className="flex-1 bg-red-50 text-red-700 font-semibold py-3 rounded-lg text-center">
              ⛔ Booking đã hủy
            </div>
          )}

          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
