import { Link } from "react-router-dom";

interface TourCardProps {
  tour: any;
}

export default function TourCard({ tour }: TourCardProps) {
  const departures = tour.departures || [];

  const sortedDepartures = [...departures].sort(
    (a, b) =>
      new Date(a.departure_date).getTime() -
      new Date(b.departure_date).getTime(),
  );

  const topDepartures = sortedDepartures.slice(0, 5);

  return (
    <div className="flex bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* ẢNH */}
      <div className="w-[180px] h-[140px] flex-shrink-0">
        <img
          src={tour.image_url}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NỘI DUNG */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* TOP */}
        <div>
          {/* TÊN TOUR */}
          <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-2">
            {tour.name}
          </h3>

          {/* INFO */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
            {tour.code && (
              <span>
                🏷️ <b>{tour.code}</b>
              </span>
            )}

            {tour.departure_location && (
              <span>📍 {tour.departure_location}</span>
            )}

            {tour.days && (
              <span>
                ⏱ {tour.days}N{tour.days - 1}Đ
              </span>
            )}

            {tour.transport && <span>✈️ {tour.transport}</span>}
          </div>

          {/* NGÀY KHỞI HÀNH */}
          {topDepartures.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Ngày khởi hành:</span>

              {topDepartures.map((d) => (
                <span
                  key={d.id}
                  className="bg-white text-red-600 text-xs font-medium px-2 py-1 rounded border border-red-300"
                >
                  {new Date(d.departure_date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="flex items-end justify-between mt-3">
          {/* GIÁ */}
          <div>
            <span className="text-xs text-gray-500 block">Giá từ</span>
            <span className="text-xl font-bold text-red-600">
              {tour.price ? Number(tour.price).toLocaleString() : "0"}{" "}
              <span className="text-base font-normal">đ</span>
            </span>
          </div>

          {/* BUTTON */}
          <Link to={`/tours/${tour.id}`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
