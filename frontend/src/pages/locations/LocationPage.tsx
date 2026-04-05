import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface Country {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
  description: string;
  image_url: string;
  address: string;
  country_id: number;
  country_name?: string; // Thêm field này để hiển thị tên nước trên card
  tag?: string;
  hotels_count?: number;
  tours_count?: number;
}

export default function LocationPage() {
  const [randomSeed, setRandomSeed] = useState(Date.now());
  const [countries, setCountries] = useState<Country[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [countryId, setCountryId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Giữ lại logic Pause nếu bạn dùng cho Slider, ở trang Page này có thể chưa cần
  // nhưng mình cứ khai báo để tránh lỗi code bạn đưa vào
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) setRandomSeed(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, [isPaused]);

  /* Load dữ liệu */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/countries")
      .then((res) => res.json())
      .then(setCountries);

    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then(setAllLocations);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [countryId, search]);

  /* Logic lọc */
  const filteredBase = allLocations.filter((loc) => {
    const matchCountry = countryId === "all" || loc.country_id === countryId;
    const matchSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  const randomizedLocations = [...filteredBase];
  if (randomSeed) {
    for (let i = randomizedLocations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(randomSeed + i)) * (i + 1));
      [randomizedLocations[i], randomizedLocations[j]] = [
        randomizedLocations[j],
        randomizedLocations[i],
      ];
    }
  }

  const totalPages = Math.ceil(randomizedLocations.length / PAGE_SIZE);
  const pagedLocations = randomizedLocations.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-16 px-4 md:px-0 mb-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Điểm đến mộng mơ
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Khám phá những vùng đất mới, trải nghiệm văn hóa đa dạng và tạo ra
            những kỷ niệm khó quên.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu hôm nay?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-800 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="w-full md:w-64 flex-shrink-0">
            <div className="relative group">
              {/* Icon MapPin nằm bên trong Select để giữ style đồng nhất */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>

              <select
                value={countryId}
                onChange={(e) => {
                  const val = e.target.value;
                  setCountryId(val === "all" ? "all" : Number(val));
                }}
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-semibold appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all shadow-sm hover:bg-slate-100"
              >
                <option value="all">Tất cả khu vực</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Mũi tên chỉ xuống trang trí cho Select */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Locations Grid - Đã thay thế bằng Code mới của bạn */}
        {randomizedLocations.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-3xl">
              🏜️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Không tìm thấy địa điểm
            </h3>
            <p className="text-slate-500">
              Vui lòng thử từ khóa tìm kiếm hoặc bộ lọc khác.
            </p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-all duration-500 ease-in-out"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {pagedLocations.map((item, idx) => (
                <Link
                  key={`${item.id}-${idx}`}
                  to={`/locations/${item.id}`}
                  className="group relative block rounded-[2rem] overflow-hidden bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 aspect-[4/5] w-full"
                >
                  {/* Ảnh Nền */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      alt={item.name}
                    />
                  </div>

                  {/* Lớp phủ Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Nội dung đè lên ảnh */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-cyan-400 font-bold mb-1 text-sm tracking-wider uppercase">
                      {item.country_name || "Destination"}
                    </p>
                    <h3 className="font-extrabold text-white text-2xl mb-2">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full border bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <span className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100 font-bold text-slate-700">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-full border bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
