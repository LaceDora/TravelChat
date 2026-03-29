import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
}

export default function ExploreSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        const allTours: Tour[] = data.data ?? data;
        // Lấy top 4 tour có discount_percent cao nhất và > 0
        const sorted = allTours
          .filter((t) => t.discount_percent && t.discount_percent > 0)
          .sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0))
          .slice(0, 4);
        setTours(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Ưu đãi tour sốc nhất
      </h2>
      {loading ? (
        <div className="text-center py-10">Đang tải ưu đãi...</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không có tour ưu đãi nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="flex flex-col bg-white rounded-2xl shadow-lg p-4 h-full"
            >
              <img
                src={tour.image_url}
                alt={tour.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {tour.name}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-red-600">
                  {tour.price && tour.discount_percent
                    ? (
                        tour.price -
                        (tour.price * tour.discount_percent) / 100
                      ).toLocaleString("vi-VN")
                    : (tour.price ?? 0).toLocaleString("vi-VN")}{" "}
                  đ
                </span>
                {tour.discount_percent && tour.discount_percent > 0 && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold text-sm">
                    -{tour.discount_percent}%
                  </span>
                )}
              </div>
              {tour.discount_percent && tour.discount_percent > 0 && (
                <span className="text-gray-400 line-through text-base mb-2">
                  {tour.price?.toLocaleString("vi-VN")} đ
                </span>
              )}
              <div className="flex flex-wrap gap-2 text-gray-600 text-xs mb-3">
                {tour.departure_location && (
                  <span>📍 {tour.departure_location}</span>
                )}
                {tour.days && <span>⏱ {tour.days} ngày</span>}
                {tour.transport && <span>✈️ {tour.transport}</span>}
              </div>
              <Link
                to={`/tours/${tour.id}`}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
// ...existing code...
