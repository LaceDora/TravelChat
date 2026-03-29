import { useEffect, useState } from "react";
import TourCard from "./TourCard";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  passport_number?: string;
  country?: {
    id: number;
    name: string;
  };
}

interface Tour {
  id: number;
  name: string;
  image_url: string;
  days?: number;
  price?: number;
  discount_percent?: number;
  departures?: any[];
  departure_location?: string;
  transport?: string;
  country?: {
    id: number;
    name: string;
  };
}

export default function TourPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("default");
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [randomSeed, setRandomSeed] = useState(Date.now());
  const PAGE_SIZE = 10;
  // Auto random mỗi 1 phút
  useEffect(() => {
    const interval = setInterval(() => setRandomSeed(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Lấy country user từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user: UserProfile = JSON.parse(stored);
        setUserCountry(user.country?.name || null);
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tours")
      .then((res) => res.json())
      .then((data) => setTours(data.data ?? data))
      .finally(() => setLoading(false));
  }, []);

  // Reset về trang 1 khi filter/search đổi
  useEffect(() => {
    setPage(1);
  }, [filter, sort, userCountry, search]);

  // Lọc tour
  let filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(search.toLowerCase()),
  );
  // Randomize order if randomSeed changes
  const randomizedTours = [...filteredTours];
  if (randomSeed) {
    for (let i = randomizedTours.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(randomSeed + i)) * (i + 1));
      [randomizedTours[i], randomizedTours[j]] = [
        randomizedTours[j],
        randomizedTours[i],
      ];
    }
  }
  if (filter === "good-price") {
    filteredTours = filteredTours.filter(
      (tour) => tour.discount_percent && tour.discount_percent > 0,
    );
  } else if (filter === "early-departure") {
    filteredTours = filteredTours.filter(
      (tour) =>
        tour.departures &&
        tour.departures.length > 0 &&
        tour.departures[0]?.date &&
        new Date(tour.departures[0].date) > new Date(),
    );
  } else if (filter === "domestic") {
    filteredTours = filteredTours.filter(
      (tour) =>
        tour.country?.name &&
        userCountry &&
        tour.country.name.toLowerCase() === userCountry.toLowerCase(),
    );
  } else if (filter === "international") {
    filteredTours = filteredTours.filter(
      (tour) =>
        tour.country?.name &&
        userCountry &&
        tour.country.name.toLowerCase() !== userCountry.toLowerCase(),
    );
  }

  // Sắp xếp tour
  if (sort === "price-asc") {
    filteredTours = [...filteredTours].sort(
      (a, b) => (a.price ?? 0) - (b.price ?? 0),
    );
  } else if (sort === "price-desc") {
    filteredTours = [...filteredTours].sort(
      (a, b) => (b.price ?? 0) - (a.price ?? 0),
    );
  }

  const totalPages = Math.ceil(randomizedTours.length / PAGE_SIZE);
  const pagedTours = randomizedTours.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Thanh tìm kiếm */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Tìm tour du lịch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full border outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          🌏 Tour du lịch nổi bật
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Khám phá các tour hot với giá ưu đãi
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="text-gray-500 animate-pulse">Đang tải tour...</span>
        </div>
      ) : filteredTours.length === 0 ? (
        <p className="text-center text-gray-500 py-20">Chưa có tour nào</p>
      ) : (
        <>
          {/* FILTER BAR */}

          <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${filter === "all" ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setFilter("all")}
              >
                Tất cả
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${filter === "good-price" ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setFilter("good-price")}
              >
                Giá tốt
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${filter === "early-departure" ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setFilter("early-departure")}
              >
                Khởi hành sớm
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${filter === "domestic" ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setFilter("domestic")}
                disabled={!userCountry}
                title={
                  !userCountry
                    ? "Bạn cần chọn quốc gia trong hồ sơ cá nhân"
                    : ""
                }
              >
                Tour trong nước
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded-full ${filter === "international" ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setFilter("international")}
                disabled={!userCountry}
                title={
                  !userCountry
                    ? "Bạn cần chọn quốc gia trong hồ sơ cá nhân"
                    : ""
                }
              >
                Tour ngoài nước
              </button>
            </div>
            <select
              className="border px-3 py-1.5 rounded text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          {/* LIST TOUR */}
          <div className="flex flex-col gap-5">
            {pagedTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded border bg-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded border bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
