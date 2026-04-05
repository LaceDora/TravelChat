import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { Link } from "react-router-dom";
import { Search, Hotel, UtensilsCrossed, Star } from "lucide-react"; // Thêm icon cho sinh động

interface Service {
  id: number;
  name: string;
  image_url?: string;
  rating?: number;
  price_per_night?: number;
  avg_price?: number;
  discount_percent?: number;
  is_promotion?: boolean;
  promotion_end?: string;
}

export default function ServicePage() {
  const [hotels, setHotels] = useState<Service[]>([]);
  const [restaurants, setRestaurants] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [randomSeed, setRandomSeed] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setRandomSeed(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, restaurantRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/hotels"),
          fetch("http://127.0.0.1:8000/api/restaurants"),
        ]);

        const hotelJson = await hotelRes.json();
        const restaurantJson = await restaurantRes.json();

        const hotelData = (hotelJson.data ?? hotelJson).map((item: any) => ({
          ...item,
          image_url: item.image_url || item.image || "",
          discount_percent: item.discount_percent || 0,
          is_promotion: item.is_promotion || false,
          promotion_end: item.promotion_end || null,
        }));

        const restaurantData = (restaurantJson.data ?? restaurantJson).map(
          (item: any) => ({
            ...item,
            image_url: item.image_url || item.image || "",
            avg_price: item.avg_price || item.min_price || 0,
            discount_percent: item.discount_percent || 0,
            is_promotion: item.is_promotion || false,
            promotion_end: item.promotion_end || null,
          }),
        );

        setHotels(hotelData);
        setRestaurants(restaurantData);
      } catch (error) {
        console.error("Lỗi load API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    // Loading skeletons
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mb-8 animate-pulse">
          <div className="h-48 bg-gradient-to-r from-blue-200 to-blue-100 rounded-3xl mb-6" />
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 h-72 flex flex-col gap-4 animate-pulse"
            >
              <div className="h-32 bg-slate-200 rounded-lg" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-6 bg-slate-100 rounded w-1/3 mt-auto" />
            </div>
          ))}
        </div>
        <p className="text-slate-400 mt-10 animate-pulse font-medium">
          Đang tải dữ liệu dịch vụ...
        </p>
      </div>
    );
  }

  let filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()),
  );
  let filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (randomSeed) {
    for (let i = filteredHotels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(randomSeed + i)) * (i + 1));
      [filteredHotels[i], filteredHotels[j]] = [
        filteredHotels[j],
        filteredHotels[i],
      ];
    }
    for (let i = filteredRestaurants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(randomSeed + i)) * (i + 1));
      [filteredRestaurants[i], filteredRestaurants[j]] = [
        filteredRestaurants[j],
        filteredRestaurants[i],
      ];
    }
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen pb-20">
      {/* Banner hình ảnh du lịch */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 flex items-center justify-center mb-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Travel Banner"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/60 to-white/0" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 animate-fade-in">
            Dịch vụ du lịch đặc sắc
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-medium animate-fade-in delay-100">
            Khám phá nơi nghỉ ngơi và ẩm thực tuyệt vời nhất cho chuyến đi của
            bạn
          </p>
        </div>
      </div>

      {/* HEADER SECTION (Tìm kiếm) */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm khách sạn, nhà hàng theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all text-lg bg-white"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* 🔹 HOTEL SECTION */}
        <section className="bg-gradient-to-br from-blue-100 via-white to-blue-50 p-8 rounded-[2rem] shadow-md border border-slate-100 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-200 rounded-2xl shadow">
                <Hotel className="w-8 h-8 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Khách sạn nổi bật
                  <Star className="w-5 h-5 text-yellow-400" />
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Có {filteredHotels.length} khách sạn phù hợp
                </p>
              </div>
            </div>
            {hotels.length > 6 && (
              <Link
                to="/services/hotels"
                className="px-6 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-500 font-bold transition-colors shadow-lg shadow-blue-100"
              >
                Xem tất cả
              </Link>
            )}
          </div>

          {filteredHotels.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              Không tìm thấy khách sạn nào
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.slice(0, 6).map((h) => (
                <div
                  key={`hotel-${h.id}`}
                  className="transition-transform hover:-translate-y-2 hover:shadow-xl duration-300"
                >
                  <ServiceCard data={h} type="hotel" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🔹 RESTAURANT SECTION */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 p-8 rounded-[2rem] shadow-md border border-slate-100 animate-fade-in-up delay-150">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-200 rounded-2xl shadow">
                <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Khám phá ẩm thực
                  <Star className="w-5 h-5 text-yellow-400" />
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Có {filteredRestaurants.length} nhà hàng đang chờ bạn
                </p>
              </div>
            </div>
            {restaurants.length > 6 && (
              <Link
                to="/services/restaurants"
                className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-500 font-bold transition-colors shadow-lg shadow-orange-100"
              >
                Xem tất cả
              </Link>
            )}
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              Không tìm thấy nhà hàng nào
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.slice(0, 6).map((r) => (
                <div
                  key={`restaurant-${r.id}`}
                  className="transition-transform hover:-translate-y-2 hover:shadow-xl duration-300"
                >
                  <ServiceCard data={r} type="restaurant" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {/* CSS cho animation fade-in */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease both;
        }
        .animate-fade-in-up.delay-150 {
          animation-delay: 0.15s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
