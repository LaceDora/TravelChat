import { useEffect, useState } from "react";
import TourCard from "../tours/TourCard";

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

export default function TourBestDiscount() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        const tours: Tour[] = data.data ?? data;
        // Lấy tour có discount_percent cao nhất
        const best = tours.reduce(
          (max, t) =>
            (t.discount_percent ?? 0) > (max.discount_percent ?? 0) ? t : max,
          tours[0],
        );
        setTour(best && (best.discount_percent ?? 0) > 0 ? best : null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10">Đang tải ưu đãi...</div>;
  }

  if (!tour) {
    return (
      <div className="text-center py-10 text-gray-500">
        Không có tour ưu đãi nào.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Ưu đãi tour sốc nhất
      </h2>
      <TourCard tour={tour} />
      <div className="text-center mt-4">
        <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-lg">
          Giảm {tour.discount_percent}%
        </span>
      </div>
    </div>
  );
}
