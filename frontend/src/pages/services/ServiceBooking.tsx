import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiPost } from "../../service/api";
import {
  ArrowLeft,
  Calendar,
  Info,
  CreditCard,
  ClipboardList,
} from "lucide-react";

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
  const [service, setService] = useState<any>(null); // Thông tin dịch vụ

  // Lấy thông tin dịch vụ và giá dịch vụ từ API
  useEffect(() => {
    async function fetchServiceAndPrice() {
      if (!id || !type) return;
      // Lấy thông tin dịch vụ (hotel hoặc restaurant)
      let serviceUrl = "";
      if (type === "hotel") {
        serviceUrl = `http://127.0.0.1:8000/api/hotels/${id}`;
      } else if (type === "restaurant") {
        serviceUrl = `http://127.0.0.1:8000/api/restaurants/${id}`;
      }
      if (serviceUrl) {
        try {
          const res = await fetch(serviceUrl);
          const data = await res.json();
          setService(data.data ?? data);
        } catch {
          setService(null);
        }
      }
      // Lấy giá dịch vụ theo item_id
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
    fetchServiceAndPrice();
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
      // Lấy user từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setError("Bạn cần đăng nhập để đặt dịch vụ.");
        setLoading(false);
        return;
      }
      const body = {
        booking_type: type, // hotel | restaurant
        target_id: id,
        booking_date: date,
        note,
        item_id: itemId,
        quantity,
        people,
        total_amount: total,
        user_id: user.id,
      };
      const data = await apiPost<any>("/bookings", body);
      const booking = data.data || data.booking || data;
      navigate(
        `/payment?bookingId=${booking.id}` +
          `&price=${booking.total_amount || total}` +
          `&people=${people}` +
          `&date=${date}` +
          `&serviceType=${type}` +
          `&serviceId=${id}` +
          `&itemId=${itemId || ""}`,
      );
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Đặt{" "}
          {type === "hotel"
            ? "Phòng Khách Sạn"
            : type === "restaurant"
              ? "Bàn Nhà Hàng"
              : "Dịch Vụ"}
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* ===== THÔNG TIN DỊCH VỤ (BÊN TRÁI) ===== */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* Ảnh Service (Nếu có data service truyền vào) */}
            <img
              src={service?.image_url || "https://via.placeholder.com/800x400"}
              className="w-full h-[250px] object-cover"
              alt={service?.name || "Thông tin dịch vụ"}
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {service?.name || "Thông tin dịch vụ"}
              </h2>

              <div className="space-y-4">
                {/* Ngày đặt */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Calendar size={14} /> Chọn ngày đặt{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-gray-800 font-medium"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <ClipboardList size={16} /> Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                    placeholder="Yêu cầu đặc biệt, ví dụ: tầng cao, ít cay, vị trí cửa sổ..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== CHI TIẾT THANH TOÁN (BÊN PHẢI) ===== */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> Chi tiết thanh
              toán
            </h2>

            {/* Hiển thị lỗi/thành công */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg font-medium">
                {success}
              </div>
            )}

            {/* Đơn giá */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Đơn giá cơ bản
              </p>
              <span className="text-2xl font-bold text-gray-800">
                {unitPrice.toLocaleString()}{" "}
                <small className="text-sm font-normal">VND</small>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Số lượng */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Số {type === "hotel" ? "phòng" : "bàn"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full border border-gray-200 rounded-lg pl-3 pr-2 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={loading}
                  />
                </div>
              </div>
              {/* Số người */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Số người
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={people}
                    onChange={(e) =>
                      setPeople(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full border border-gray-200 rounded-lg pl-3 pr-2 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* TỔNG TIỀN */}
            <div className="mb-8 p-5 bg-blue-50 rounded-2xl flex justify-between items-center border border-blue-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-black text-blue-700">
                  {total.toLocaleString()}{" "}
                  <small className="text-sm font-bold">VND</small>
                </span>
              </div>
              <Info size={20} className="text-blue-300" />
            </div>

            {/* NÚT XÁC NHẬN */}
            <button
              onClick={submit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-100"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </span>
              ) : (
                "XÁC NHẬN ĐẶT NGAY"
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-6 uppercase tracking-widest font-medium">
              Hỗ trợ 24/7 • Quy trình nhanh chóng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
