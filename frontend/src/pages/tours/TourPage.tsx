import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownUp,
  MapPin,
  Clock,
  Plane,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Interfaces ---
interface UserProfile {
  id: number;
  name: string;
  country?: { id: number; name: string };
}

interface Tour {
  id: number;
  name: string;
  image_url: string;
  days?: number;
  price?: number;
  discount_percent?: number;
  departure_location?: string;
  transport?: string;
  country?: { id: number; name: string };
  departures?: { id: number; departure_date: string; status: string }[];
}

type FilterTab =
  | "all"
  | "best_price"
  | "earliest"
  | "domestic"
  | "international";
type SortOption = "default" | "price_asc" | "price_desc";

export default function TourPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [randomSeed, setRandomSeed] = useState(Date.now());
  const [searchInput, setSearchInput] = useState("");
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tours")
      .then((res) => res.json())
      .then((data) => setTours(data.data ?? data))
      .finally(() => setLoading(false));

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user: UserProfile = JSON.parse(stored);
        setUserCountry(user.country?.name || null);
      } catch (e) {
        console.error(e);
      }
    }

    const interval = setInterval(() => setRandomSeed(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const processedTours = useMemo(() => {
    let result = [...tours];

    // Lọc theo từ khóa tìm kiếm (realtime)
    if (searchInput.trim() !== "") {
      result = result.filter((t) =>
        t.name.toLowerCase().includes(searchInput.trim().toLowerCase()),
      );
    }

    if (activeFilter === "best_price") {
      result = result.filter((t) => (t.discount_percent ?? 0) > 0);
    } else if (activeFilter === "earliest") {
      result = result.filter((t) =>
        t.departures?.some((d) => new Date(d.departure_date) > new Date()),
      );
    } else if (activeFilter === "domestic" && userCountry) {
      result = result.filter(
        (t) => t.country?.name?.toLowerCase() === userCountry.toLowerCase(),
      );
    } else if (activeFilter === "international" && userCountry) {
      result = result.filter(
        (t) => t.country?.name?.toLowerCase() !== userCountry.toLowerCase(),
      );
    }

    if (sortBy === "default") {
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.abs(Math.sin(randomSeed + i)) * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return result;
  }, [tours, activeFilter, sortBy, randomSeed, userCountry, searchInput]);

  const totalPages = Math.ceil(processedTours.length / PAGE_SIZE);
  const pagedTours = processedTours.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + " VND";

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "best_price", label: "Giá tốt" },
              { key: "earliest", label: "Khởi hành sớm" },
              { key: "domestic", label: "Trong nước", disabled: !userCountry },
              {
                key: "international",
                label: "Quốc tế",
                disabled: !userCountry,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                disabled={tab.disabled}
                onClick={() => {
                  setActiveFilter(tab.key as FilterTab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === tab.key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tìm kiếm realtime */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minWidth: 180 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setPage(1);
              }}
              className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* List Tour (Kiểu ngang như ảnh) */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">
            Đang tải danh sách tour...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pagedTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
              >
                {/* Ảnh bên trái */}
                <div className="w-full md:w-72 h-48 md:h-auto relative overflow-hidden bg-slate-200">
                  <img
                    src={tour.image_url}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {tour.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        {tour.departure_location || "Chưa xác định"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {tour.days}N{tour.days ? tour.days - 1 : 0}Đ
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Plane className="w-4 h-4 text-blue-500" />
                        {tour.transport || "Máy bay"}
                      </div>
                    </div>

                    {tour.departures && tour.departures.length > 0 && (
                      <div className="text-sm mb-4">
                        <span className="text-slate-500">Ngày khởi hành: </span>
                        <span className="text-red-500 font-semibold border border-red-200 rounded px-2 py-0.5 ml-1 bg-red-50">
                          {new Date(
                            tour.departures[0].departure_date,
                          ).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Giá từ</p>
                      <p className="text-2xl font-extrabold text-red-600">
                        {formatPrice(tour.price || 0)}
                      </p>
                    </div>
                    <Link
                      to={`/tours/${tour.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold px-4 text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
