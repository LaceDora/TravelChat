import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { apiGet, apiPost, API_BASE } from "../../service/api";
import toast from "react-hot-toast";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    apiGet<any>(`/bookings/${id}?user_id=${user.id}`)
      .then((data) => setBooking(data.data ?? data))
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

    try {
      const data = await apiPost<any>(
        `/bookings/${id}/cancel?user_id=${user.id}`,
        {},
      );
      toast.success("Đã hủy booking thành công");
      setBooking(data.booking || data);
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
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

        {/* Info Grid - Changed to Boarding Pass / E-Ticket style for paid bookings */}
        {booking.status === "paid" ? (
          <div className="mb-8 border-2 border-dashed border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-center border-b border-blue-100 pb-4">
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-widest">
                  E-Ticket
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {booking.booking_type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Khách Hàng
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {JSON.parse(localStorage.getItem("user") || "{}").name ||
                      "Quý khách"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Mã Đặt Chỗ
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    #{booking.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Lịch Trình
                  </p>
                  <p className="font-bold text-gray-800">
                    {booking.check_in
                      ? new Date(booking.check_in).toLocaleDateString("vi-VN")
                      : new Date(booking.booking_date).toLocaleDateString(
                          "vi-VN",
                        )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Số Lượng
                  </p>
                  <p className="font-bold text-gray-800">
                    {booking.quantity} người
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block border-l-2 border-dashed border-blue-200 h-40 mx-2"></div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-w-[200px]">
              <QRCodeCanvas
                value={JSON.stringify({
                  booking_id: booking.id,
                  target: booking.target_id,
                  type: booking.booking_type,
                })}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              <p className="text-[10px] text-gray-500 mt-3 font-mono tracking-widest">
                SCAN TO CHECK IN
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Loại đặt</p>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {booking.booking_type}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Ngày lịch trình</p>
                <p className="text-lg font-semibold text-gray-800">
                  {booking.check_in
                    ? new Date(booking.check_in).toLocaleDateString("vi-VN")
                    : new Date(booking.booking_date).toLocaleDateString(
                        "vi-VN",
                      )}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Số lượng</p>
                <p className="text-lg font-semibold text-gray-800">
                  {booking.quantity || 1}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">
                  Mã tham chiếu (Target ID)
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {booking.target_id}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Thời gian tạo HĐ</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(booking.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        )}

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
        <div className="flex gap-4 mt-8">
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
            <div className="flex-1 bg-red-50 text-red-700 font-semibold py-3 rounded-lg text-center flex items-center justify-center">
              ⛔ Booking đã bị hủy
            </div>
          )}

          {booking.status === "paid" && (
            <button
              onClick={async () => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                try {
                  toast.loading("Đang tạo hóa đơn PDF...", { id: "pdf" });
                  const response = await fetch(
                    `${API_BASE}/bookings/${booking.id}/pdf?user_id=${user.id}`,
                    {
                      method: "GET",
                      headers: { Accept: "application/pdf" },
                      credentials: "omit",
                    },
                  );
                  if (!response.ok) throw new Error("Không thể tải hóa đơn");

                  const blob = await response.blob();

                  await new Promise<void>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result) {
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = reader.result as string;
                        a.download = `HoaDon_${booking.id}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        resolve();
                      } else {
                        reject(new Error("Không thể tạo dữ liệu tải xuống"));
                      }
                    };
                    reader.onerror = () =>
                      reject(new Error("Lỗi đọc file (FileReader)"));
                    reader.readAsDataURL(blob);
                  });

                  toast.success("Tải hóa đơn thành công!", { id: "pdf" });
                } catch (error) {
                  toast.error(
                    "Lỗi hệ thống khi tải PDF. Vui lòng thử lại sau.",
                    { id: "pdf" },
                  );
                }
              }}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold flex items-center justify-center gap-2 py-3 rounded-lg transition"
            >
              <span>📄</span> Tải Hóa Đơn PDF
            </button>
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
