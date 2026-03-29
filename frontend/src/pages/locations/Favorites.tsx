import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationCard from "./LocationCard";

export default function Favorites() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD FAVORITES =================
  useEffect(() => {
    const favIds: number[] = JSON.parse(
      localStorage.getItem("favorite_locations") || "[]",
    );

    if (favIds.length === 0) {
      setLocations([]);
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 lọc ra đúng location đã yêu thích
        const favLocations = data.filter((loc: any) => favIds.includes(loc.id));
        setLocations(favLocations);
      })
      .finally(() => setLoading(false));
  }, []);

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sky-700">
              ❤️ Địa điểm yêu thích
            </h1>
            <p className="text-sm text-gray-500">
              Danh sách các địa điểm bạn đã lưu
            </p>
          </div>

          <button
            onClick={() => navigate("/locations")}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow"
          >
            🔙 Quay lại
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : locations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 mb-4">
              Bạn chưa có địa điểm yêu thích nào 💔
            </p>
            <button
              onClick={() => navigate("/locations")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Khám phá ngay 🚀
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
