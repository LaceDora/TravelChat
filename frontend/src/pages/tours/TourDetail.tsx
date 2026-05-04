import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarDays,
  Users,
  CheckCircle,
  Timer,
  Plane,
  ChevronDown,
  Info,
} from "lucide-react";
// Import component TourReview
import TourReview from "./TourReview";

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState<any>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<any>(null);
  // Quản lý việc đóng mở ngày (mặc định mở ngày 1)
  const [openDay, setOpenDay] = useState<number | null>(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tours/${id}`)
      .then((res) => res.json())
      .then((data) => setTour(data));
  }, [id]);

  // --- LOGIC NHÓM LỊCH TRÌNH THEO NGÀY ---
  const groupedSchedules = useMemo(() => {
    if (!tour?.schedules) return [];

    const groups = tour.schedules.reduce((acc: any, item: any) => {
      const day = item.day_number;
      if (!acc[day]) {
        acc[day] = {
          day_number: day,
          activities: [],
        };
      }
      acc[day].activities.push(item);
      return acc;
    }, {});

    return Object.values(groups).sort(
      (a: any, b: any) => a.day_number - b.day_number,
    );
  }, [tour?.schedules]);

  const departures = tour?.departures || [];

  const sortedDepartures = [...departures]
    .filter((d) => d.status === "available")
    .sort(
      (a, b) =>
        new Date(a.departure_date).getTime() -
        new Date(b.departure_date).getTime(),
    );

  useEffect(() => {
    if (sortedDepartures.length > 0 && !selectedDeparture) {
      setSelectedDeparture(sortedDepartures[0]);
    }
  }, [tour, sortedDepartures]);

  if (!tour) {
    return (
      <div className="flex justify-center py-20 text-slate-500 animate-pulse font-medium">
        Đang tải thông tin tour...
      </div>
    );
  }

  // ===== LOGIC GIÁ CẢ & KHUYẾN MÃI =====
  const price = selectedDeparture?.price || 0;
  const discount = selectedDeparture?.is_promotion
    ? selectedDeparture?.discount_percent || 0
    : 0;
  const finalPrice =
    discount > 0
      ? Math.round(price - (price * discount) / 100)
      : Math.round(price);
  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + " VND";

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* 1. HERO SECTION */}
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
          <div className="flex flex-wrap gap-3 mb-4">
            {tour.departure_location && (
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Khởi hành:{" "}
                {tour.departure_location}
              </div>
            )}
            {tour.location?.name && (
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Điểm đến:{" "}
                {tour.location.name}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>
                {tour.days} Ngày{" "}
                {tour.days - 1 > 0 ? `${tour.days - 1} Đêm` : ""}
              </span>
            </div>
            {tour.transport && (
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                <span>
                  Phương tiện: <b>{tour.transport}</b>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* CỘT TRÁI - THÔNG TIN CHI TIẾT */}
          <div className="lg:w-2/3 space-y-10">
            {/* Gallery ảnh thực tế */}
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

            {/* PHẦN LỊCH TRÌNH - ĐÃ GỘP NGÀY THEO Ý BẠN */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-10">
                Lịch trình chi tiết
              </h2>
              <div className="relative border-l-2 border-slate-100 ml-6 space-y-12">
                {groupedSchedules.map((group: any) => {
                  const isOpen = openDay === group.day_number;
                  return (
                    <div key={group.day_number} className="relative pl-10">
                      {/* Dot Timeline */}
                      <div
                        className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors duration-300 ${isOpen ? "bg-blue-600 ring-4 ring-blue-50" : "bg-slate-300"}`}
                      ></div>

                      {/* Tiêu đề Ngày (Chỉ hiển thị 1 lần cho nhiều hoạt động) */}
                      <div
                        className="cursor-pointer group"
                        onClick={() =>
                          setOpenDay(isOpen ? null : group.day_number)
                        }
                      >
                        <span className="text-blue-600 font-black text-sm uppercase tracking-widest mb-1 block">
                          NGÀY {group.day_number}
                        </span>

                        {/* Gộp các tiêu đề hành động lại thành một hàng */}
                        <div className="flex flex-wrap items-center gap-2">
                          {group.activities.map((act: any, idx: number) => (
                            <h3
                              key={act.id}
                              className={`text-xl font-bold transition-colors ${isOpen ? "text-blue-700" : "text-slate-800 group-hover:text-blue-600"}`}
                            >
                              {act.title}
                              {idx < group.activities.length - 1 ? " — " : ""}
                            </h3>
                          ))}
                        </div>

                        <button className="mt-2 text-slate-400 text-xs font-bold flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                          {isOpen ? "Thu gọn" : "Xem chi tiết hoạt động"}
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Nội dung chi tiết các hoạt động (Hiện ra khi bấm) */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                      >
                        <div className="space-y-4">
                          {group.activities.map((act: any) => (
                            <div
                              key={act.id}
                              className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-blue-800">
                                  {act.title}
                                </h4>
                                {act.time && (
                                  <div className="flex items-center gap-1 text-xs font-bold bg-white px-2 py-1 rounded-lg text-blue-600 border border-blue-100">
                                    <Clock size={12} /> {act.time}
                                  </div>
                                )}
                              </div>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium text-sm">
                                {act.activity || "Đang cập nhật nội dung..."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Dịch vụ bao gồm (Combo Content) */}
            {tour.combo_content && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Dịch vụ bao gồm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.combo_content
                    .split(/[\n,;]/)
                    .filter((i: any) => i.trim())
                    .map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-semibold">
                          {item.replace(/<\/?(ul|li|p)>/g, "").trim()}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Thông tin cần lưu ý (Content) */}
            {tour.content && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Thông tin cần lưu ý
                </h2>
                <div
                  className="prose prose-slate max-w-none text-slate-700 font-medium"
                  dangerouslySetInnerHTML={{ __html: tour.content }}
                />
              </section>
            )}

            {/* PHẦN BÌNH LUẬN - THÊM VÀO ĐÂY */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <TourReview tourId={Number(id)} />
            </section>
          </div>

          {/* CỘT PHẢI - BOX ĐẶT TOUR */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
              {selectedDeparture?.is_promotion === 1 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-red-100">
                  <Timer className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-tight">
                    Ưu đãi đặc biệt hôm nay!
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-slate-400 font-bold text-xs uppercase mb-1">
                  Giá tour trọn gói
                </p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-black text-red-600 tracking-tighter">
                    {formatPrice(finalPrice)}
                  </h2>
                  {discount > 0 && (
                    <span className="text-slate-300 line-through text-lg font-bold">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <label className="text-slate-800 font-black text-sm mb-4 flex items-center gap-2 uppercase">
                  <CalendarDays size={18} className="text-blue-600" /> Chọn ngày
                  khởi hành:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {sortedDepartures.map((d: any) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDeparture(d)}
                      className={`px-3 py-3 rounded-xl border-2 text-sm font-black transition-all ${selectedDeparture?.id === d.id ? "border-blue-600 bg-blue-600 text-white shadow-lg" : "border-slate-50 bg-slate-50 text-slate-500"}`}
                    >
                      {new Date(d.departure_date).toLocaleDateString("vi-VN")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 py-6 border-y border-slate-50 mb-8 font-bold text-sm">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="flex items-center gap-2 font-medium">
                    <Users size={16} /> Chỗ trống
                  </span>
                  <span className="text-emerald-600">
                    {selectedDeparture?.capacity - selectedDeparture?.booked}{" "}
                    người
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/booking-tour?tourId=${id}&departureId=${selectedDeparture?.id}`,
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-tight"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
