import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Clock, CalendarDays, Users } from "lucide-react";

export default function BookingTour() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tourId = searchParams.get("tourId");
  const departureId = searchParams.get("departureId");

  const [tour, setTour] = useState<any>(null);
  const [departure, setDeparture] = useState<any>(null);
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tours/${tourId}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data);
        const dep = data.departures.find(
          (d: any) => String(d.id) === String(departureId),
        );
        setDeparture(dep);
      });
  }, [tourId, departureId]);

  if (!tour || !departure) {
    return (
      <p className="text-center py-20 text-gray-500">Đang tải dữ liệu...</p>
    );
  }

  const price = departure.price;
  const discount = departure.discount_percent || 0;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  const total = finalPrice * people;

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Bạn cần đăng nhập");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          booking_type: "tour",
          target_id: tourId,
          departure_id: departureId,
          booking_date: departure.departure_date,
          quantity: people,
          total_amount: total,
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        let realTourId = tour?.id?.toString() || tourId || "";
        const params = new URLSearchParams({
          bookingId: data.id,
          tourId: realTourId,
          tourName: tour.name || "",
          price: total.toString(),
          people: people.toString(),
          date: departure.departure_date || "",
        });
        navigate(`/payment?${params.toString()}`);
      } else {
        alert(data.message || "Lỗi đặt tour");
      }
    } catch (err) {
      alert("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Nút quay lại nhỏ gọn */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Đặt tour của bạn
        </h1>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* ===== TOUR INFO (GIỮ NGUYÊN KHUNG) ===== */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <img
              src={tour.image_url}
              className="w-full h-[200px] object-cover"
              alt={tour.name}
            />
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                {tour.name}
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Khởi hành:{" "}
                  <span className="font-medium text-gray-800">
                    {tour.departure_location}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  Thời gian:{" "}
                  <span className="font-medium text-gray-800">
                    {tour.days} ngày
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  Ngày đi:{" "}
                  <span className="font-medium text-blue-600">
                    {new Date(departure.departure_date).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ===== BOOKING FORM (GIỮ NGUYÊN KHUNG) ===== */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">
              Chi tiết thanh toán
            </h2>

            {/* PRICE */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Giá mỗi khách
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-600">
                  {finalPrice.toLocaleString()}{" "}
                  <small className="text-sm">VND</small>
                </span>
                {discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {price.toLocaleString()} VND
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 text-xs rounded mt-1 font-medium">
                  Giảm {discount}%
                </span>
              )}
            </div>

            {/* PEOPLE */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users size={16} /> Số lượng người
              </label>
              <input
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* TOTAL */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">
                Tổng tiền:
              </span>
              <span className="text-xl font-bold text-blue-700">
                {total.toLocaleString()} VND
              </span>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-md ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
              }`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT TOUR"}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4 uppercase tracking-tighter">
              Đảm bảo giá tốt nhất • Thanh toán an toàn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
