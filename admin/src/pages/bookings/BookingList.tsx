import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "../../components/table/DataTable";
import { Booking, getBookings } from "../../services/BookingService";
import { Link } from "react-router-dom";

const columns: TableColumn<Booking>[] = [
  { key: "id", title: "ID" },
  { key: "user_id", title: "User ID" },
  { key: "booking_type", title: "Loại đặt" },
  { key: "target_id", title: "Mã đối tượng" },
  { key: "check_in", title: "Check In" },
  { key: "check_out", title: "Check Out" },
  { key: "booking_date", title: "Ngày đặt" },
  { key: "quantity", title: "Số lượng" },
  { key: "total_amount", title: "Tổng tiền" },
  { key: "payment_type", title: "Thanh toán" },
  { key: "status", title: "Trạng thái" },
  {
    key: "actions",
    title: "Hành động",
    render: (row) => <Link to={`/admin/bookings/${row.id}`}>Chi tiết</Link>,
  },
];

const BookingList: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBookings()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Quản lý Booking</h2>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
};

export default BookingList;
