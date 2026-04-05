import { Link } from "react-router-dom";
import { Hotel, UtensilsCrossed } from "lucide-react";

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
    <Link
      to={`/services/${type}/${data.id}`}
      className="group block focus:outline-none"
    >
      <div
        className={`border rounded-xl overflow-hidden bg-white relative transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 ${
          data.is_promotion &&
          data.discount_percent &&
          data.discount_percent > 0
            ? "shadow-[0_4px_24px_0_rgba(239,68,68,0.15)]"
            : "hover:shadow-lg"
        }`}
        style={{ minHeight: 320 }}
      >
        {/* IMAGE + icon overlay */}
        <div className="relative">
          <img
            src={data.image_url || "https://via.placeholder.com/400x250"}
            alt={data.name}
            className="h-48 w-full object-cover rounded-t-xl transition-all duration-300 group-hover:scale-105"
          />
          {/* Icon overlay bottom right */}
          <span className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1.5 shadow-md">
            {type === "hotel" ? (
              <Hotel className="w-5 h-5 text-blue-500" />
            ) : (
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            )}
          </span>
        </div>

        {/* Đánh giá sao góc phải trên */}
        {data.rating && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 shadow flex items-center gap-1 text-yellow-500 text-sm font-semibold z-10 animate-rating-bounce">
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
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
            {data.name}
          </h3>

          {/* TYPE */}
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {type === "hotel" ? (
              <Hotel className="w-4 h-4 inline-block text-blue-400" />
            ) : (
              <UtensilsCrossed className="w-4 h-4 inline-block text-orange-400" />
            )}
            {type === "hotel" ? "Khách sạn" : "Nhà hàng"}
          </p>

          {/* PRICE Section */}
          {price ? (
            <div className="space-y-1">
              {/* Giá cũ (nếu có khuyến mãi) */}
              {data.is_promotion &&
              data.discount_percent &&
              data.discount_percent > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 line-through text-sm decoration-slate-400 decoration-1">
                    {type === "hotel"
                      ? `${Number(price).toLocaleString()} VND`
                      : `${(Number(price) * 0.8).toLocaleString()} - ${Number(price).toLocaleString()} VND`}
                  </span>
                </div>
              ) : null}

              {/* Giá hiện tại + Badge giảm giá */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-red-500 font-bold text-xl">
                  {data.is_promotion &&
                  data.discount_percent &&
                  data.discount_percent > 0
                    ? type === "hotel"
                      ? `${(Number(price) * (1 - data.discount_percent / 100)).toLocaleString()} VND`
                      : // Hiển thị dải giá cho Restaurant giống ảnh
                        `${(Number(price) * 0.7).toLocaleString()} - ${(Number(price) * (1 - data.discount_percent / 100)).toLocaleString()} VND`
                    : `${Number(price).toLocaleString()} VND`}
                </span>

                {/* Badge giảm giá nằm ngay sau giá giống ảnh 2 */}
                {data.is_promotion &&
                  data.discount_percent &&
                  data.discount_percent > 0 && (
                    <span className="bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-md">
                      -{data.discount_percent}%
                    </span>
                  )}
              </div>

              {/* Đơn vị tính */}
              <p className="text-xs text-gray-400 font-medium">
                Giá{" "}
                {type === "hotel" ? "trung bình / đêm" : "trung bình / người"}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      {/* Animation CSS */}
      <style>{`
        .animate-rating-bounce {
          animation: ratingBounce 0.7s cubic-bezier(.68,-0.55,.27,1.55) 1;
        }
        @keyframes ratingBounce {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Link>
  );
}
