import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HotelService from "../../services/HotelService";
import {
  Hotel as HotelIcon,
  Plus,
  Pencil,
  Trash2,
  DoorOpen,
} from "lucide-react";

interface Hotel {
  id: number;
  location_id: number | null;
  name: string;
  rating?: number | null;
  price_per_night: number;
  discount_percent: number | null;
  image_url?: string | null;
  address?: string | null;
  location?: { id: number; name: string } | null;
}

export default function HotelsList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ search + pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await HotelService.getHotels();
      setHotels(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa khách sạn này?")) return;
    try {
      await HotelService.deleteHotel(id);
      setHotels(hotels.filter((h) => h.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FILTER
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ PAGINATION
  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentData = filteredHotels.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <HotelIcon size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Khách sạn
            </h1>
            <p className="text-xs text-gray-400">
              {filteredHotels.length} khách sạn
            </p>
          </div>
        </div>

        <Link
          to="/admin/hotels/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      </div>

      {/* SEARCH */}
      <div className="w-72">
        <input
          type="text"
          placeholder="Tìm khách sạn..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-400">
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Hình ảnh</th>
                <th className="px-5 py-3 text-left">Tên</th>
                <th className="px-5 py-3 text-left">Khu vực</th>
                <th className="px-5 py-3 text-center">Rating</th>
                <th className="px-5 py-3 text-right">Giá/đêm</th>
                <th className="px-5 py-3 text-center">Giảm giá</th>
                <th className="px-5 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((hotel) => (
                <tr key={hotel.id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {hotel.id}
                  </td>

                  <td className="px-5 py-4">
                    {hotel.image_url ? (
                      <img
                        src={hotel.image_url}
                        className="w-20 h-14 object-cover rounded"
                      />
                    ) : (
                      "No img"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold">{hotel.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-50">
                      {hotel.address && hotel.address.trim() !== ""
                        ? hotel.address
                        : "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {hotel.location?.name || "—"}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {hotel.rating ? (
                      <span className="text-amber-500 font-bold">
                        ⭐ {hotel.rating}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* 💰 FORMAT TIỀN */}
                  <td className="px-5 py-4 text-right font-medium">
                    {new Intl.NumberFormat("vi-VN").format(
                      hotel.price_per_night || 0,
                    )}{" "}
                    VNĐ
                  </td>

                  <td className="px-5 py-4 text-center">
                    {hotel.discount_percent ? (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                        -{hotel.discount_percent}%
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/hotels/${hotel.id}/rooms`}
                        className="p-2 hover:text-emerald-600"
                      >
                        <DoorOpen size={16} />
                      </Link>

                      <Link
                        to={`/admin/hotels/edit/${hotel.id}`}
                        className="p-2 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="p-2 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentData.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
