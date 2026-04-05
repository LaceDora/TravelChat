import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingTour() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tourId = searchParams.get("tourId");
  const departureId = searchParams.get("departureId");

  const [tour, setTour] = useState<any>(null);
  const [departure, setDeparture] = useState<any>(null);

  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);

  // ===== GET TOUR =====
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tours/${tourId}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data);
        console.log("tour object", data);

        const dep = data.departures.find(
          (d: any) => String(d.id) === String(departureId),
        );

        setDeparture(dep);
      });
  }, [tourId, departureId]);

  if (!tour || !departure) {
    return <p className="text-center py-20">Loading...</p>;
  }

  // ===== PRICE =====
  const price = departure.price;
  const discount = departure.discount_percent || 0;

  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const total = finalPrice * people;

  // ===== BOOKING =====
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
        headers: {
          "Content-Type": "application/json",
        },
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
        // Truyền đủ params sang trang Payment
        navigate(
          (() => {
            // Fallback: lấy tourId từ tour.id, nếu không có thì lấy từ biến tourId
            let realTourId =
              tour && tour.id ? tour.id.toString() : tourId || "";
            const params = new URLSearchParams({
              bookingId: data.id,
              tourId: realTourId,
              tourName: tour.name || "",
              price: total.toString(),
              people: people.toString(),
              date: departure.departure_date || "",
            });
            return `/payment?${params.toString()}`;
          })(),
        );
      } else {
        alert(data.message || "Lỗi đặt tour");
      }
    } catch (err) {
      alert("Lỗi server");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Đặt tour</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ===== TOUR INFO ===== */}
        <div className="border rounded-xl p-6 bg-white">
          <img
            src={tour.image_url}
            className="w-full h-[220px] object-cover rounded-lg mb-4"
          />

          <h2 className="text-xl font-semibold mb-2">{tour.name}</h2>

          <p className="text-gray-600 mb-2">
            📍 Khởi hành: {tour.departure_location}
          </p>

          <p className="text-gray-600 mb-2">⏱ {tour.days} ngày</p>

          <p className="text-gray-600">
            📅 {new Date(departure.departure_date).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* ===== BOOKING FORM ===== */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-6">Thông tin đặt tour</h2>

          {/* PRICE */}
          <div className="mb-4">
            {discount > 0 ? (
              <>
                <p className="text-2xl font-bold text-red-600">
                  {finalPrice.toLocaleString()} VND
                </p>

                <p className="text-gray-400 line-through">
                  {price.toLocaleString()} VND
                </p>

                <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded">
                  -{discount}%
                </span>
              </>
            ) : (
              <p className="text-2xl font-bold text-red-600">
                {price.toLocaleString()} VND
              </p>
            )}

            <p className="text-sm text-gray-500">/ khách</p>
          </div>

          {/* PEOPLE */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Số người</label>

            <input
              type="number"
              min={1}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* TOTAL */}
          <div className="mb-6 text-lg font-semibold text-blue-600">
            Tổng tiền: {total.toLocaleString()} VND
          </div>

          {/* BUTTON */}
          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt tour"}
          </button>
        </div>
      </div>
    </div>
  );
}
