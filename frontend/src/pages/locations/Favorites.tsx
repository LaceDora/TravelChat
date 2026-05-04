import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, Search, Loader2, MapPin } from "lucide-react";
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
        const list = data.data ?? data; // Đề phòng trường hợp API bọc trong data
        const favLocations = list.filter((loc: any) => favIds.includes(loc.id));
        setLocations(favLocations);
      })
      .catch((err) => console.error("Lỗi tải yêu thích:", err))
      .finally(() => setLoading(false));
  }, []);

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors group"
            >
              <ChevronLeft
                size={20}
                className="text-slate-600 group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Điểm đến yêu thích
                </h1>
                <Heart
                  size={24}
                  className="text-rose-500 fill-rose-500 animate-pulse"
                />
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Bạn có {locations.length} địa điểm đã lưu trong danh sách
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/locations")}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Search size={18} /> Khám phá thêm địa điểm
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500 font-medium">
              Đang tìm lại các kỷ niệm của bạn...
            </p>
          </div>
        ) : locations.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-rose-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Danh sách trống
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Có vẻ như bạn chưa lưu địa điểm nào. Hãy bắt đầu hành trình khám
              phá thế giới ngay hôm nay!
            </p>
            <button
              onClick={() => navigate("/locations")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <MapPin size={20} /> Tìm địa điểm mới ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {locations.map((location) => (
              <div key={location.id} className="group relative">
                {/* Thêm một lớp bọc để tạo hiệu ứng nổi bật khi hover */}
                <div className="transition-transform duration-300 group-hover:-translate-y-2">
                  <LocationCard location={location} />
                </div>
                {/* Badge Yêu thích nhỏ ở góc nếu bạn muốn nhấn mạnh */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                  <Heart size={16} className="text-rose-500 fill-rose-500" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER INFO */}
        {locations.length > 0 && (
          <p className="mt-12 text-center text-slate-400 text-sm font-medium italic">
            Sử dụng các địa điểm này để lập kế hoạch cho chuyến đi tiếp theo của
            bạn ✨
          </p>
        )}
      </div>
    </div>
  );
}
