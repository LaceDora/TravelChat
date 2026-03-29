import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TourBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState<any>(null);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/tours/${id}`)
      .then((res) => res.json())
      .then(setTour);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!date) {
      alert("Vui lòng chọn ngày khởi hành");
      setLoading(false);
      return;
    }

    const totalPrice = tour.price * people;

    // Chuyển hướng đến trang thanh toán
    navigate(
      `/payment?tourId=${id}&price=${totalPrice}&people=${people}&date=${date}&tourName=${encodeURIComponent(
        tour.name,
      )}`,
    );

    setLoading(false);
  };

  if (!tour) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Đặt tour: {tour.name}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* DATE */}
        <div>
          <label className="block mb-1 font-medium">Ngày khởi hành</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* PEOPLE */}
        <div>
          <label className="block mb-1 font-medium">Số người</label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* PRICE */}
        {tour.price && (
          <p className="text-lg font-semibold text-blue-600">
            Tổng tiền: {(tour.price * people).toLocaleString()} VND
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt tour"}
        </button>
      </form>
    </div>
  );
}
