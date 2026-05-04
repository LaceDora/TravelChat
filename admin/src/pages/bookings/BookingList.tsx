import React, { useEffect, useState } from "react";
import {
  Booking,
  deleteBooking,
  getBookings,
} from "../../services/BookingService";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

const BookingList: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // States cho Tìm kiếm và Phân trang
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số lượng dòng trên mỗi trang

  useEffect(() => {
    setLoading(true);
    getBookings()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (bookingId: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa booking #${bookingId}?`)) {
      return;
    }

    setDeletingId(bookingId);

    try {
      await deleteBooking(bookingId);
      setData((prev) => prev.filter((item) => item.id !== bookingId));
    } catch (error) {
      alert("Xóa booking thất bại, vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  // 1. Xử lý lọc dữ liệu (Tìm theo User ID hoặc Loại đặt hoặc Trạng thái)
  const filteredData = data.filter(
    (item) =>
      item.user_id?.toString().includes(search.toLowerCase()) ||
      item.booking_type?.toLowerCase().includes(search.toLowerCase()) ||
      item.status?.toLowerCase().includes(search.toLowerCase()),
  );

  // 2. Xử lý phân trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải dữ liệu đặt chỗ...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý Đặt chỗ</h1>
            <p className="text-xs text-gray-400">
              {filteredData.length} đơn đặt
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Tìm theo User ID, loại, trạng thái..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400 border-b border-gray-50">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">User ID</th>
                <th className="px-5 py-3.5">Loại đặt</th>
                <th className="px-5 py-3.5">Mã đối tượng</th>
                <th className="px-5 py-3.5">Thời gian</th>
                <th className="px-5 py-3.5">SL</th>
                <th className="px-5 py-3.5 text-right">Tổng tiền</th>
                <th className="px-5 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-500 font-medium">
                    {row.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {row.user_id}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-purple-100 text-purple-600">
                      {row.booking_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {row.target_id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">In:</span>{" "}
                      {row.check_in
                        ? new Date(row.check_in).toLocaleDateString("vi-VN")
                        : "—"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      <span className="font-semibold">Out:</span>{" "}
                      {row.check_out
                        ? new Date(row.check_out).toLocaleDateString("vi-VN")
                        : "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {row.quantity}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-gray-800">
                      {Number(row.total_amount || 0).toLocaleString("vi-VN")}
                      <span className="ml-1 text-[10px] text-gray-400 font-normal text-right">
                        VNĐ
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        row.status === "paid"
                          ? "bg-blue-100 text-blue-600"
                          : row.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-600"
                            : row.status === "completed"
                              ? "bg-cyan-100 text-cyan-600"
                              : row.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/bookings/${row.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        title="Xem chi tiết"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                        className={`p-2 rounded-lg transition-colors inline-flex ${
                          deletingId === row.id
                            ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                            : "text-red-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Xóa booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy đơn đặt chỗ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-gray-50">
            <div className="text-xs text-gray-500">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredData.length)} trong tổng số{" "}
              {filteredData.length}
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === 1
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === totalPages
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
