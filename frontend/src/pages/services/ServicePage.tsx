import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { Link } from "react-router-dom";

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
  // Auto random mỗi 1 phút
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

        // 👉 Chuẩn hóa dữ liệu (QUAN TRỌNG)
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

  // 👉 Loading đẹp hơn (giống skeleton)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Lọc theo tên
  let filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()),
  );
  let filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );
  // Randomize order if randomSeed changes
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
    <div className="max-w-7xl mx-auto px-4 space-y-16 pb-20">
      {/* Thanh tìm kiếm */}
      <div className="mb-8 flex items-center gap-3">
        <input
          type="text"
          placeholder="Tìm khách sạn, nhà hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full border outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* 🔹 HOTEL */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Khách sạn</h1>
            <span className="text-sm text-gray-500">
              {filteredHotels.length} khách sạn
            </span>
          </div>
          {hotels.length > 6 && (
            <Link
              to="/services/hotels"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow"
            >
              Xem tất cả khách sạn
            </Link>
          )}
        </div>

        {filteredHotels.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu khách sạn</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.slice(0, 6).map((h) => (
              <ServiceCard key={`hotel-${h.id}`} data={h} type="hotel" />
            ))}
          </div>
        )}
      </section>

      {/* 🔹 RESTAURANT */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Nhà hàng</h1>
            <span className="text-sm text-gray-500">
              {filteredRestaurants.length} nhà hàng
            </span>
          </div>
          {restaurants.length > 6 && (
            <Link
              to="/services/restaurants"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold shadow"
            >
              Xem tất cả nhà hàng
            </Link>
          )}
        </div>

        {filteredRestaurants.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu nhà hàng</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.slice(0, 6).map((r) => (
              <ServiceCard
                key={`restaurant-${r.id}`}
                data={r}
                type="restaurant"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
