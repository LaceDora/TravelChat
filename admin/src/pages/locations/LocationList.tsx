import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationService from "../../services/LocationService";
import { MapPin, Plus, Pencil, Trash2, Search, Eye } from "lucide-react";

export default function LocationsList() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [countryFilter, setCountryFilter] = useState("");
  const [sortViews, setSortViews] = useState<"asc" | "desc" | "">("");

  const ITEMS_PER_PAGE = 10;

  const fetchLocations = async () => {
    try {
      const data = await LocationService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa địa điểm này?")) return;
    try {
      await LocationService.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  // 🔍 FILTER
  // Lấy danh sách quốc gia duy nhất
  const countryList = Array.from(
    new Set(locations.map((loc) => loc.country?.name).filter(Boolean)),
  );

  // Lọc và sắp xếp
  let filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (countryFilter) {
    filteredLocations = filteredLocations.filter(
      (loc) => loc.country?.name === countryFilter,
    );
  }

  if (sortViews === "asc") {
    filteredLocations = filteredLocations.sort(
      (a, b) => (a.views_count || 0) - (b.views_count || 0),
    );
  } else if (sortViews === "desc") {
    filteredLocations = filteredLocations.sort(
      (a, b) => (b.views_count || 0) - (a.views_count || 0),
    );
  } else {
    filteredLocations = filteredLocations.sort((a, b) => a.id - b.id);
  }

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredLocations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <MapPin size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý Địa điểm
            </h1>
            <p className="text-xs text-gray-400">
              {filteredLocations.length} địa điểm
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/locations/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative w-72 mb-2">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-400">
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Hình ảnh</th>
                <th className="px-5 py-3 text-left">Tên</th>
                <th className="px-5 py-3 text-left relative group">
                  <span>Quốc gia</span>
                  <button
                    className="ml-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                    title="Lọc theo quốc gia"
                    tabIndex={0}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M4 7h16M7 12h10m-4 5h-2"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full z-10 bg-white border rounded shadow-md p-2 min-w-30 hidden group-hover:block group-focus-within:block">
                    <select
                      value={countryFilter}
                      onChange={(e) => {
                        setCountryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2 py-1 border rounded text-xs text-gray-700"
                    >
                      <option value="">Tất cả</option>
                      {countryList.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="px-5 py-3 text-left">Địa chỉ</th>
                <th className="px-5 py-3 text-left">Content</th>
                <th className="px-5 py-3 text-center relative group">
                  <span>Lượt xem</span>
                  <button
                    className="ml-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                    title="Sắp xếp lượt xem"
                    tabIndex={0}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M12 4v16m0 0-4-4m4 4 4-4"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full z-10 bg-white border rounded shadow-md p-2 flex flex-col gap-1 min-w-22.5 invisible group-hover:visible group-focus-within:visible">
                    <button
                      className={`px-2 py-1 border rounded text-xs text-left ${sortViews === "desc" ? "bg-blue-600 text-white" : ""}`}
                      onClick={() =>
                        setSortViews(sortViews === "desc" ? "" : "desc")
                      }
                    >
                      Cao đến thấp
                    </button>
                    <button
                      className={`px-2 py-1 border rounded text-xs text-left ${sortViews === "asc" ? "bg-blue-600 text-white" : ""}`}
                      onClick={() =>
                        setSortViews(sortViews === "asc" ? "" : "asc")
                      }
                    >
                      Thấp đến cao
                    </button>
                  </div>
                </th>
                <th className="px-5 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((loc) => (
                <tr key={loc.id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-4">{loc.id}</td>

                  <td className="px-5 py-4">
                    {loc.image_url ? (
                      <img
                        src={loc.image_url}
                        className="w-20 h-14 object-cover rounded"
                      />
                    ) : (
                      "No img"
                    )}
                  </td>

                  <td className="px-5 py-4 font-semibold">{loc.name}</td>

                  <td className="px-5 py-4">{loc.country?.name || "—"}</td>
                  <td
                    className="px-5 py-4 overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ maxWidth: "150px" }}
                  >
                    {loc.address}
                  </td>

                  <td
                    className="px-5 py-4 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500"
                    style={{ maxWidth: "200px" }}
                  >
                    {loc.content || "—"}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {loc.views_count || 0}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      {/* 👁 Xem chi tiết */}
                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:5173/locations/${loc.id}`,
                            "_blank",
                          )
                        }
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>

                      {/* ✏️ Sửa */}
                      <button
                        onClick={() =>
                          navigate(`/admin/locations/edit/${loc.id}`)
                        }
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* 🗑 Xóa */}
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
