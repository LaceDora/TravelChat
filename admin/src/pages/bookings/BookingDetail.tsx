import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Booking,
  getBookingById,
  updateBookingStatus,
} from "../../services/BookingService";
import { ArrowLeft, ClipboardList, Save } from "lucide-react";

// Việt hóa các tùy chọn trạng thái
const statusOptions = [
  { value: "pending", label: "Đang chờ" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "completed", label: "Hoàn thành" },
  { value: "paid", label: "Đã thanh toán" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  paid: "bg-blue-100 text-blue-700",
  completed: "bg-cyan-100 text-cyan-700",
  cancelled: "bg-red-100 text-red-700",
};

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBookingById(Number(id))
        .then((res) => {
          setBooking(res);
          setStatus(res.status);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleStatusChange = async () => {
    if (!booking) return;
    setUpdating(true);
    try {
      await updateBookingStatus(booking.id, status);
      setBooking({ ...booking, status });
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      alert("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải thông tin...
      </div>
    );

  if (!booking)
    return (
      <div className="text-center py-20 text-gray-400">
        Không tìm thấy thông tin đơn đặt chỗ này.
      </div>
    );

  const bookingTypeLabel: Record<string, string> = {
    hotel: "Khách sạn",
    tour: "Tour du lịch",
    restaurant: "Nhà hàng",
  };

  const infoRows = [
    {
      label: "Khách hàng",
      value: booking.user?.name || `Người dùng #${booking.user_id}`,
    },
    { label: "Email liên hệ", value: booking.user?.email || "—" },
    {
      label: "Loại dịch vụ",
      value: (
        <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-purple-100 text-purple-600">
          {bookingTypeLabel[booking.booking_type] || booking.booking_type}
        </span>
      ),
    },
    { label: "Mã dịch vụ (ID)", value: `#${booking.target_id}` },
    {
      label: "Ngày nhận (Check In)",
      value: booking.check_in
        ? new Date(booking.check_in).toLocaleDateString("vi-VN")
        : "—",
    },
    {
      label: "Ngày trả (Check Out)",
      value: booking.check_out
        ? new Date(booking.check_out).toLocaleDateString("vi-VN")
        : "—",
    },
    {
      label: "Ngày thực hiện đặt",
      value: booking.booking_date
        ? new Date(booking.booking_date).toLocaleDateString("vi-VN")
        : "—",
    },
    { label: "Số lượng đặt", value: `${booking.quantity} đơn vị` },
    {
      label: "Tổng tiền thanh toán",
      value: (
        <span className="text-lg font-bold text-emerald-600">
          {Number(booking.total_amount || 0).toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    { label: "Hình thức thanh toán", value: booking.payment_type || "—" },
    { label: "Ghi chú từ khách", value: booking.note || "Không có" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Chi tiết đơn đặt #{booking.id}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">Trạng thái:</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${statusStyle[booking.status] || "bg-gray-100 text-gray-600"}`}
              >
                {statusOptions.find((opt) => opt.value === booking.status)
                  ?.label || booking.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/bookings")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Thông tin chi tiết đơn hàng
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {infoRows.map((row, i) => (
            <div key={i} className="flex items-center px-6 py-4">
              <span className="w-48 text-sm text-gray-400 font-medium shrink-0">
                {row.label}
              </span>
              <span className="text-sm text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Cập nhật trạng thái đơn hàng
          </h2>
        </div>
        <div className="px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-52 bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            disabled={updating || status === booking.status}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {updating ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
