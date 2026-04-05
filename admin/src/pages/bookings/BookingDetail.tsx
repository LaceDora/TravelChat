import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Booking,
  getBookingById,
  updateBookingStatus,
} from "../../services/BookingService";

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    await updateBookingStatus(booking.id, status);
    setBooking({ ...booking, status });
    setUpdating(false);
  };

  if (loading) return <div>Đang tải...</div>;
  if (!booking) return <div>Không tìm thấy booking</div>;

  return (
    <div>
      <h2>Chi tiết Booking #{booking.id}</h2>
      <ul>
        <li>User ID: {booking.user_id}</li>
        <li>Loại đặt: {booking.booking_type}</li>
        <li>Mã đối tượng: {booking.target_id}</li>
        <li>Check In: {booking.check_in}</li>
        <li>Check Out: {booking.check_out}</li>
        <li>Ngày đặt: {booking.booking_date}</li>
        <li>Số lượng: {booking.quantity}</li>
        <li>Tổng tiền: {booking.total_amount}</li>
        <li>Thanh toán: {booking.payment_type}</li>
        <li>
          Trạng thái:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            disabled={updating}
            style={{ marginLeft: 8 }}
          >
            Cập nhật
          </button>
        </li>
        <li>Ghi chú: {booking.note}</li>
      </ul>
    </div>
  );
};

export default BookingDetail;
