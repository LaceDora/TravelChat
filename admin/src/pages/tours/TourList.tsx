import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TourService from "../../services/TourService";
import {
  Map,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

interface Tour {
  id: number;
  location_id: number;
  name: string;
  days: number;
  transport?: string;
  departure_location?: string;
  image_url?: string;
  description?: string;
  is_active: boolean;
  location?: { id: number; name: string };
}

export default function TourList() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    try {
      const data = await TourService.getTours();
      setTours(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa tour này?")) return;
    try {
      await TourService.deleteTour(id);
      setTours((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(search.toLowerCase()) ||
      tour.departure_location?.toLowerCase().includes(search.toLowerCase()) ||
      tour.location?.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTours.length / toursPerPage);
  const currentTours = filteredTours.slice(
    (currentPage - 1) * toursPerPage,
    currentPage * toursPerPage,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
            <Map size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý Tour</h1>
            <p className="text-xs text-gray-400">
              {tours.length} tour trong hệ thống
            </p>
          </div>
        </div>
        <Link
          to="/admin/tours/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm no-underline"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      </div>

      <div className="w-72">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm tour..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400 border-b border-gray-50">
                <th className="px-5 py-3.5 text-center w-12">STT</th>
                <th className="px-5 py-3.5">Hình ảnh</th>
                <th className="px-5 py-3.5">Thông tin Tour</th>
                <th className="px-5 py-3.5">Khu vực</th>
                <th className="px-5 py-3.5 text-center">Thời gian</th>
                <th className="px-5 py-3.5">Di chuyển đi</th>
                <th className="px-5 py-3.5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentTours.map((tour, idx) => (
                <tr
                  key={tour.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-center text-sm text-gray-500 font-semibold">
                    {(currentPage - 1) * toursPerPage + idx + 1}
                  </td>
                  <td className="px-5 py-4">
                    {tour.image_url ? (
                      <img
                        src={tour.image_url}
                        alt={tour.name}
                        className="w-16 h-12 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      {/* Tên tour: Để hiển thị tự nhiên, không giới hạn dòng, không cắt chữ */}
                      <div className="text-sm font-semibold text-gray-800 leading-tight">
                        {tour.name}
                      </div>

                      {/* Địa điểm: Hiển thị ngay bên dưới với font nhỏ hơn */}
                      {tour.departure_location && (
                        <div className="text-xs text-gray-400 mt-1">
                          Khởi hành từ: {tour.departure_location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {tour.location?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                    {tour.days} ngày
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 capitalize">
                    {tour.transport || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1.5">
                      <Link
                        to={`/admin/tours/${tour.id}/schedules`}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Lịch trình chi tiết"
                      >
                        <LayoutGrid size={16} />
                      </Link>

                      <Link
                        to={`/admin/tours/${tour.id}/departures`}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Ngày khởi hành"
                      >
                        <CalendarDays size={16} />
                      </Link>
                      <Link
                        to={`/admin/tours/edit/${tour.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTours.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy tour nào khớp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center gap-3 py-6 border-t border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all shadow-sm"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div className="flex items-center gap-1 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-all shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 italic">
              Trang {currentPage} trên {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
