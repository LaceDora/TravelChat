import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// Thêm các icon cho đẹp, nếu bạn chưa cài lucide-react hãy chạy: npm install lucide-react
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarDays,
  Users,
  CheckCircle,
  ChevronDown,
  Info,
} from "lucide-react";

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
    return (
      <div className="flex justify-center py-20 text-slate-500 animate-pulse">
        Loading tour...
      </div>
    );
  }

  // ===== PRICE LOGIC (GIỮ NGUYÊN CỦA BẠN) =====
  const price = selectedDeparture?.price || 0;
  const discount = selectedDeparture?.discount_percent || 0;
  const finalPrice =
    discount > 0
      ? Math.round(price - (price * discount) / 100)
      : Math.round(price);

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + " VND";

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* 1. HERO SECTION - HIỂN THỊ ẢNH LỚN VÀ TIÊU ĐỀ */}
      <div className="relative h-[55vh] min-h-[400px] w-full bg-slate-900">
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>
        <img
          src={tour.image_url}
          alt={tour.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-12">
          {/* Địa điểm xuất phát + Tên địa điểm */}
          <div className="flex flex-wrap gap-3 mb-2">
            {tour.departure_location && (
              <div className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                <MapPin className="w-4 h-4" /> {tour.departure_location}
              </div>
            )}
            {tour.location?.name && (
              <div className="inline-flex items-center gap-2 bg-green-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                <MapPin className="w-4 h-4" /> Địa điểm: {tour.location.name}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200 font-medium">
            {tour.days && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>
                  {tour.days} Ngày
                  {tour.days - 1 > 0 ? ` ${tour.days - 1} Đêm` : ""}
                </span>
              </div>
            )}
            {tour.transport && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                <span>
                  Phương tiện: <b>{tour.transport}</b>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Đảm bảo giá tốt nhất</span>
            </div>
          </div>
          {/* Nội dung chi tiết (content) */}
          {tour.content && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Nội dung chi tiết
              </h2>
              <div
                className="prose max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: tour.content }}
              />
            </section>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* CỘT TRÁI: CHI TIẾT TOUR */}
          <div className="lg:w-2/3 space-y-12">
            {/* Gallery ảnh phụ */}
            {tour.media_gallery &&
              Array.isArray(tour.media_gallery) &&
              tour.media_gallery.length > 0 && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" /> Hình ảnh thực tế
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tour.media_gallery.map((url: string, idx: number) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Gallery"
                        className="w-full h-32 object-cover rounded-xl border hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </section>
              )}

            {/* Mô tả tổng quan */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Tổng quan chuyến đi
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {tour.description}
              </p>
            </section>

            {/* Lịch khởi hành (Chọn ngày) */}
            {sortedDepartures.length > 0 && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-blue-500" /> Chọn ngày
                  khởi hành
                </h2>
                <div className="flex flex-wrap gap-3">
                  {sortedDepartures.map((d: any) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDeparture(d)}
                      className={`px-5 py-3 rounded-xl border-2 transition-all font-bold ${
                        selectedDeparture?.id === d.id
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200"
                      }`}
                    >
                      {new Date(d.departure_date).toLocaleDateString("vi-VN")}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Thông tin thêm (GIỮ LOGIC REGEX CỦA BẠN) */}
            {tour.combo_content && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Thông tin quan trọng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const ulMatch =
                      tour.combo_content.match(/<ul>([\s\S]*?)<\/ul>/);
                    if (ulMatch) {
                      const liMatches =
                        ulMatch[1].match(/<li>([\s\S]*?)<\/li>/g);
                      if (liMatches) {
                        return liMatches.map((li: string, idx: number) => {
                          const text = li.replace(/<li>|<\/li>/g, "").trim();
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                            >
                              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                              <span className="text-slate-700 font-medium">
                                {text}
                              </span>
                            </div>
                          );
                        });
                      }
                    }
                    return tour.combo_content
                      .split(/[,;\n]/)
                      .map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                          <span className="text-slate-700 font-medium">
                            {item.trim()}
                          </span>
                        </div>
                      ));
                  })()}
                </div>
              </section>
            )}

            {/* Lịch trình chi tiết */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Lịch trình chi tiết
              </h2>
              <div className="space-y-6">
                {tour.schedules
                  ?.sort((a: any, b: any) => a.day_number - b.day_number)
                  .map((s: any) => (
                    <div
                      key={s.id}
                      className="relative pl-10 pb-6 border-l-2 border-blue-100 last:border-0 last:pb-0"
                    >
                      <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                      <div className="bg-slate-50 p-5 rounded-2xl">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">
                          Ngày {s.day_number}: {s.title}
                        </h3>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                          {s.activity || "Chưa có nội dung"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>

          {/* CỘT PHẢI: BOX ĐẶT TOUR (STICKY) */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="mb-6">
                <p className="text-slate-500 font-medium mb-1">Giá ưu đãi từ</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-black text-red-600 tracking-tight">
                    {formatPrice(finalPrice)}
                  </h2>
                  {discount > 0 && (
                    <span className="text-slate-400 line-through text-lg">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="inline-block bg-red-100 text-red-600 px-2 py-1 text-xs font-bold rounded mt-2">
                    TIẾT KIỆM {discount}%
                  </span>
                )}
                {/* Thông tin khuyến mãi nếu có */}
                {selectedDeparture?.is_promotion &&
                  selectedDeparture?.promotion_end && (
                    <span className="block mt-2 text-xs text-orange-600 font-semibold">
                      Khuyến mãi đến hết ngày:{" "}
                      {new Date(
                        selectedDeparture.promotion_end,
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  )}
              </div>

              <div className="space-y-4 py-6 border-y border-slate-100 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Ngày đi
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedDeparture
                      ? new Date(
                          selectedDeparture.departure_date,
                        ).toLocaleDateString("vi-VN")
                      : "---"}
                  </span>
                </div>
                {selectedDeparture && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Chỗ trống
                    </span>
                    <span className="font-bold text-green-600">
                      {selectedDeparture.capacity - selectedDeparture.booked}{" "}
                      chỗ
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/booking-tour?tourId=${id}&departureId=${selectedDeparture?.id}`,
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Đặt ngay
              </button>

              <div className="mt-6 space-y-3 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Xác nhận
                  tức thì
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Hỗ trợ 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
