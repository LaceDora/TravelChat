import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState<any>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tours/${id}`)
      .then((res) => res.json())
      .then((data) => setTour(data));
  }, [id]);

  const departures = tour?.departures || [];

  const sortedDepartures = [...departures]
    .filter((d) => d.status === "available")
    .sort(
      (a, b) =>
        new Date(a.departure_date).getTime() -
        new Date(b.departure_date).getTime(),
    );

  useEffect(() => {
    if (sortedDepartures.length > 0) {
      setSelectedDeparture(sortedDepartures[0]);
    }
  }, [tour]);

  if (!tour) {
    return <p className="text-center py-20">Loading tour...</p>;
  }

  // ===== PRICE =====
  const price = selectedDeparture?.price || 0;
  const discount = selectedDeparture?.discount_percent || 0;
  // Hiển thị giá là số nguyên, không có phần thập phân
  const finalPrice =
    discount > 0
      ? Math.round(price - (price * discount) / 100)
      : Math.round(price);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* NÚT QUAY LẠI */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 flex items-center gap-2"
      >
        <span className="text-lg">←</span> Quay lại
      </button>
      {/* ===== TOP SECTION ===== */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* IMAGE */}
        <div className="md:col-span-2">
          <img
            src={tour.image_url}
            alt={tour.name}
            className="w-full h-[420px] object-cover rounded-2xl mb-4"
          />
          {/* MEDIA GALLERY */}
          {tour.media_gallery &&
            Array.isArray(tour.media_gallery) &&
            tour.media_gallery.length > 0 && (
              <div className="media-gallery grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {tour.media_gallery.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Ảnh phụ ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                ))}
              </div>
            )}
        </div>

        {/* PRICE BOX */}
        <div className="border rounded-2xl p-6 shadow bg-white h-fit">
          <p className="text-gray-500">Giá từ</p>

          {discount > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-red-600">
                {finalPrice.toLocaleString("vi-VN")} đ
              </h2>

              <p className="text-gray-400 line-through text-lg">
                {Math.round(price).toLocaleString("vi-VN")} đ
              </p>

              <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded">
                -{discount}%
              </span>
            </>
          ) : (
            <h2 className="text-3xl font-bold text-red-600">
              {Math.round(price).toLocaleString("vi-VN")} đ
            </h2>
          )}

          <p className="text-sm text-gray-500 mb-4">/ Khách</p>

          <div className="space-y-2 text-sm text-gray-600">
            {tour.departure_location && (
              <p>📍 Khởi hành: {tour.departure_location}</p>
            )}

            {tour.days && <p>⏱ Thời gian: {tour.days} ngày</p>}

            {selectedDeparture && (
              <p>
                📅 Ngày khởi hành:{" "}
                {new Date(selectedDeparture.departure_date).toLocaleDateString(
                  "vi-VN",
                )}
              </p>
            )}

            {selectedDeparture && (
              <p>
                👥 Số chỗ còn:{" "}
                {selectedDeparture.capacity - selectedDeparture.booked}
              </p>
            )}
          </div>

          {/* BOOK BUTTON */}
          <button
            onClick={() =>
              navigate(
                `/booking-tour?tourId=${id}&departureId=${selectedDeparture?.id}`,
              )
            }
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
          >
            Đặt ngay
          </button>
        </div>
      </div>

      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold mt-8 mb-4">{tour.name}</h1>

      <p className="text-gray-700 mb-10">{tour.description}</p>

      {/* ===== DEPARTURES ===== */}
      {sortedDepartures.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Lịch khởi hành</h2>

          <div className="flex flex-wrap gap-3">
            {sortedDepartures.map((d: any) => (
              <button
                key={d.id}
                onClick={() => setSelectedDeparture(d)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  selectedDeparture?.id === d.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
              >
                {new Date(d.departure_date).toLocaleDateString("vi-VN")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== COMBO / THÔNG TIN THÊM ===== */}
      {tour.combo_content && (
        <div className="mb-12 combo-content-box">
          <h2 className="text-xl font-bold mb-4 text-center">
            Thông tin thêm về chuyến đi
          </h2>
          <div className="combo-content-list">
            {/* Loại bỏ thẻ HTML nếu có, chỉ hiển thị từng dòng */}
            {(() => {
              // Nếu có thẻ <ul> thì lấy các <li>, nếu không thì split như cũ
              const ulMatch = tour.combo_content.match(/<ul>([\s\S]*?)<\/ul>/);
              if (ulMatch) {
                // Lấy các <li>
                const liMatches = ulMatch[1].match(/<li>([\s\S]*?)<\/li>/g);
                if (liMatches) {
                  return liMatches.map((li: string, idx: number) => {
                    const text = li.replace(/<li>|<\/li>/g, "").trim();
                    return (
                      <div key={idx} className="combo-content-item">
                        <span className="combo-dot">•</span> {text}
                      </div>
                    );
                  });
                }
              }
              // Nếu không có <ul>, split như cũ
              return tour.combo_content
                .split(/[,;\n]/)
                .map((item: string, idx: number) => (
                  <div key={idx} className="combo-content-item">
                    <span className="combo-dot">•</span> {item.trim()}
                  </div>
                ));
            })()}
          </div>
        </div>
      )}

      {/* ===== TOUR CONTENT ===== */}
      {tour.content && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Điểm nổi bật</h2>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: tour.content,
            }}
          />
        </div>
      )}

      {/* ===== SCHEDULE ===== */}
      <h2 className="text-2xl font-semibold mb-6 text-center">Lịch trình</h2>

      {tour.schedules && tour.schedules.length > 0 ? (
        <div className="space-y-4">
          {tour.schedules
            .sort((a: any, b: any) => a.day_number - b.day_number)
            .map((s: any) => (
              <details key={s.id} className="border rounded-xl p-4 bg-white">
                <summary className="font-semibold cursor-pointer">
                  Ngày {s.day_number}: {s.title}
                </summary>

                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {s.activity || "Chưa có nội dung"}
                </p>
              </details>
            ))}
        </div>
      ) : (
        <p>Chưa có lịch trình</p>
      )}
    </div>
  );
}
