import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";

interface Service {
  id: number;
  name: string;
  image_url?: string;
  rating?: number;
  avg_price?: number;
}

export default function RestaurantListPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<string>("");
  const [filterStar, setFilterStar] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/restaurants");
        const json = await res.json();
        const restaurantData = (json.data ?? json).map((item: any) => ({
          ...item,
          image_url: item.image_url || item.image || "",
          avg_price: item.avg_price || item.min_price || 0,
        }));
        setRestaurants(restaurantData);
      } catch (error) {
        console.error("Lỗi load API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let filtered = [...restaurants];
  if (filterStar) {
    filtered = filtered.filter((r) => Math.round(r.rating || 0) === filterStar);
  }
  if (sort === "price-asc") {
    filtered.sort((a, b) => (a.avg_price || 0) - (b.avg_price || 0));
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => (b.avg_price || 0) - (a.avg_price || 0));
  } else if (sort === "star-desc") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  if (loading) {
    return <p className="text-center py-20">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium"
      >
        ← Quay lại
      </button>
      <h1 className="text-3xl font-bold mb-8">Tất cả nhà hàng</h1>
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          className="border rounded px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sắp xếp</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="star-desc">Đánh giá cao nhất</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={filterStar || ""}
          onChange={(e) =>
            setFilterStar(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Lọc theo sao</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} sao
            </option>
          ))}
        </select>
        {filterStar && (
          <button
            className="ml-2 text-blue-600 underline"
            onClick={() => setFilterStar(null)}
          >
            Xóa lọc sao
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500">Không có dữ liệu nhà hàng</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <ServiceCard
              key={`restaurant-${r.id}`}
              data={r}
              type="restaurant"
            />
          ))}
        </div>
      )}
    </div>
  );
}
