import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ServiceBooking() {
  const { id, type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy item_id từ query string nếu có
  const query = new URLSearchParams(location.search);
  const itemId = query.get("item_id");

  // Lấy ngày hôm nay (yyyy-mm-dd)
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1); // Số phòng/bàn
  const [people, setPeople] = useState(1); // Số người
  const [unitPrice, setUnitPrice] = useState(0); // Giá 1 phòng/bàn
  const [total, setTotal] = useState(0); // Tổng tiền

  // Lấy giá dịch vụ từ API (nếu có item_id)
  useEffect(() => {
    async function fetchPrice() {
      if (!id || !type) return;
      let url = "";
      if (type === "hotel" && itemId) {
        url = `http://127.0.0.1:8000/api/hotels/${id}/rooms`;
      } else if (type === "restaurant" && itemId) {
        url = `http://127.0.0.1:8000/api/restaurants/${id}/tables`;
      }
      if (url) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          const items = data.data ?? data;
          const found = items.find(
            (it: any) => String(it.id) === String(itemId),
          );
          if (found) {
            setUnitPrice(Number(found.price_per_night || found.price || 0));
          }
        } catch {}
      }
    }
    fetchPrice();
  }, [id, type, itemId]);

  // Tính tổng tiền
  useEffect(() => {
    setTotal(unitPrice * quantity);
  }, [unitPrice, quantity]);

  const submit = async () => {
    setError("");
    setSuccess("");
    if (!date) {
      setError("Vui lòng chọn ngày đặt.");
      return;
    }
    if (quantity < 1) {
      setError("Số lượng phải lớn hơn 0.");
      return;
    }
    if (people < 1) {
      setError("Số người phải lớn hơn 0.");
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
          service_type: type, // hotel | restaurant
          service_id: id,
          booking_date: date,
          note,
          item_id: itemId,
          quantity,
          people,
          total_price: total,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Đặt dịch vụ thất bại. Vui lòng thử lại.");
      } else {
        setSuccess("Đặt dịch vụ thành công!");
        setTimeout(() => navigate("/profile/1"), 1200);
      }
    } catch (e) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">
        Đặt{" "}
        {type === "hotel"
          ? "phòng khách sạn"
          : type === "restaurant"
            ? "bàn nhà hàng"
            : "dịch vụ"}
      </h1>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {success && (
        <div className="mb-4 text-green-600 font-semibold">{success}</div>
      )}

      <label className="block mb-2 font-medium">
        Chọn ngày đặt <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        className="border w-full p-3 rounded mb-4"
        value={date}
        min={today}
        onChange={(e) => setDate(e.target.value)}
        disabled={loading}
      />

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium">
            Số lượng{" "}
            {type === "hotel"
              ? "phòng"
              : type === "restaurant"
                ? "bàn"
                : "dịch vụ"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="border w-full p-3 rounded"
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium">
            Số người <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
            className="border w-full p-3 rounded"
            disabled={loading}
          />
        </div>
      </div>

      {unitPrice > 0 && (
        <div className="mb-4 text-lg font-semibold">
          Đơn giá: {unitPrice.toLocaleString()} VND
          <br />
          Tổng tiền:{" "}
          <span className="text-blue-600">{total.toLocaleString()} VND</span>
        </div>
      )}

      <label className="block mb-2 font-medium">Ghi chú (tuỳ chọn)</label>
      <textarea
        className="border w-full p-3 rounded mb-4"
        placeholder="Ghi chú cho dịch vụ, ví dụ: yêu cầu đặc biệt, số người..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Xác nhận đặt"}
      </button>
    </div>
  );
}
