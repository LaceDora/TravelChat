import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";
import { Utensils, Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ search + pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa nhà hàng này?")) return;
    try {
      await RestaurantService.deleteRestaurant(id);
      loadRestaurants();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FILTER
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ PAGINATION
  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentData = filteredRestaurants.slice(
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <Utensils size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Nhà hàng
            </h1>
            <p className="text-xs text-gray-400">
              {restaurants.length} nhà hàng
            </p>
          </div>
        </div>
        <Link
          to="/admin/restaurants/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm no-underline"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      </div>
      {/* SEARCH */}
      <div className="w-72">
        <input
          type="text"
          placeholder="Tìm nhà hàng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                <th className="px-5 py-3.5 text-left">ID</th>
                <th className="px-5 py-3.5 text-left">Hình ảnh</th>
                <th className="px-5 py-3.5 text-left">Tên</th>
                <th className="px-5 py-3.5 text-left">Khu vực</th>
                <th className="px-5 py-3.5 text-right">Giá TB</th>
                <th className="px-5 py-3.5 text-center">Đánh giá</th>
                <th className="px-5 py-3.5 text-center">Giảm giá</th>
                <th className="px-5 py-3.5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-500">{r.id}</td>
                  <td className="px-5 py-4">
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        alt={r.name}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    <div style={{ maxWidth: "180px" }}>
                      <div className="font-semibold text-gray-800 truncate">
                        {r.name}
                      </div>
                      {r.address && (
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {r.address}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {r.location?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-gray-700">
                    {r.min_price && r.max_price ? (
                      <>
                        {/* Math.floor để đảm bảo không còn số lẻ .00 trước khi định dạng */}
                        {Math.floor(r.min_price).toLocaleString("vi-VN")} -{" "}
                        {Math.floor(r.max_price).toLocaleString("vi-VN")}
                        <span className="ml-1 text-[10px] text-gray-400 font-normal">
                          VNĐ
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center text-sm">
                    {r.rating ? (
                      <span className="font-bold text-yellow-500">
                        ★ {r.rating}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                    {r.reviews_count ? (
                      <span className="ml-1 text-xs text-gray-400">
                        ({r.reviews_count})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {r.discount_percent ? (
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-600">
                        -{r.discount_percent}%
                      </span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1.5">
                      <Link
                        to={`/admin/restaurants/${r.id}/tables`}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Bàn"
                      >
                        <LayoutGrid size={16} />
                      </Link>
                      <Link
                        to={`/admin/restaurants/edit/${r.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {restaurants.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    Chưa có nhà hàng nào.
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
