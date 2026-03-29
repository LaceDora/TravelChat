import { Link } from "react-router-dom";

interface BaseService {
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

interface Props {
  data: BaseService;
  type: "hotel" | "restaurant";
}

export default function ServiceCard({ data, type }: Props) {
  // 👉 Chuẩn hóa giá
  const price = type === "hotel" ? data.price_per_night : data.avg_price;

  return (
    <Link to={`/services/${type}/${data.id}`}>
      <div className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition relative">
        {/* IMAGE */}
        <img
          src={data.image_url || "https://via.placeholder.com/400x250"}
          alt={data.name}
          className="h-48 w-full object-cover"
        />

        {/* Đánh giá sao góc phải trên */}
        {data.rating && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 shadow flex items-center gap-1 text-yellow-500 text-sm font-semibold z-10">
            {Array.from({ length: Math.round(data.rating) }, (_, i) => (
              <span key={i}>★</span>
            ))}
            <span className="text-gray-700 ml-1">{data.rating}</span>
          </div>
        )}

        {/* Badge giảm giá */}
        {data.is_promotion &&
          data.discount_percent &&
          data.discount_percent > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg shadow text-xs font-bold z-10 animate-pulse">
              -{data.discount_percent}%
            </div>
          )}

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          {/* NAME */}
          <h3 className="font-semibold text-lg line-clamp-2">{data.name}</h3>

          {/* TYPE */}
          <p className="text-sm text-gray-500">
            {type === "hotel" ? "Khách sạn" : "Nhà hàng"}
          </p>

          {/* PRICE + giảm giá */}
          {price && (
            <div className="flex items-center gap-2">
              <p className="text-red-500 font-semibold flex items-center gap-1">
                <span>💰</span>
                {data.is_promotion &&
                data.discount_percent &&
                data.discount_percent > 0 ? (
                  <>
                    <span className="line-through text-gray-400 mr-1">
                      {Number(price).toLocaleString()} VND
                    </span>
                    <span>
                      {(
                        Number(price) *
                        (1 - data.discount_percent / 100)
                      ).toLocaleString()}{" "}
                      VND
                    </span>
                  </>
                ) : (
                  <span>{Number(price).toLocaleString()} VND</span>
                )}
                <span className="text-sm text-gray-500">
                  {type === "hotel" ? " / đêm" : " / người"}
                </span>
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Xem chi tiết
          </button>
        </div>
      </div>
    </Link>
  );
}
