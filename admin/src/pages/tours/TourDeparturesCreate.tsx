import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

export default function TourDepartureCreate() {
  const { id } = useParams(); // tour id
  const navigate = useNavigate();

  const [tourName, setTourName] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    departure_date: "",
    capacity: "20",
    price: "",
    discount_percent: "0",
    is_promotion: false,
    promotion_end: "",
    status: "available", // Theo migration: available
  });

  // Khai báo các class đồng bộ với form chỉnh sửa
  const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  useEffect(() => {
    if (id) fetchTourName();
  }, [id]);

  async function fetchTourName() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name || "");
    } catch {
      setTourName("");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({
      ...formData,
      [name]: val,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await TourService.createDeparture({
        tour_id: Number(id),
        departure_date: formData.departure_date,
        capacity: Number(formData.capacity),
        booked: 0, // Mặc định khi tạo mới là 0
        price: Number(formData.price),
        discount_percent: Number(formData.discount_percent),
        is_promotion: formData.is_promotion,
        promotion_end: formData.is_promotion ? formData.promotion_end : null,
        status: formData.status,
      });

      alert("Thêm ngày khởi hành thành công!");
      navigate(`/admin/tours/${id}/departures`);
    } catch (error) {
      console.error("Lỗi tạo:", error);
      alert("Không thể tạo ngày khởi hành.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thêm Ngày khởi hành Mới
          </h1>
          <p className="text-blue-600 font-medium italic text-sm">
            Tour: {tourName}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Ngày khởi hành</label>
            <input
              type="date"
              name="departure_date"
              value={formData.departure_date}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="available">Sẵn có (Available)</option>
              <option value="full">Đầy chỗ (Full)</option>
              <option value="closed">Đã đóng (Closed)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giá gốc (VNĐ)</label>
            <input
              name="price"
              type="text"
              inputMode="numeric"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="VD: 1500000"
              className={inputClass}
            />
            {formData.price && (
              <p className="mt-1 text-[11px] text-gray-500 italic">
                Định dạng: {Number(formData.price).toLocaleString("vi-VN")} VNĐ
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              name="discount_percent"
              type="text"
              inputMode="numeric"
              value={formData.discount_percent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tổng số chỗ (Capacity)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          {/* Ẩn hoặc khóa ô Booked vì tour mới luôn có 0 người đặt */}
          <div>
            <label className={labelClass}>Số chỗ đã đặt</label>
            <input
              type="number"
              value={0}
              disabled
              className={`${inputClass} bg-gray-100 cursor-not-allowed`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="flex items-center gap-3 py-2.5">
            <input
              type="checkbox"
              id="is_promotion"
              name="is_promotion"
              checked={formData.is_promotion}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is_promotion"
              className="block text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Kích hoạt ưu đãi
            </label>
          </div>

          <div>
            <label className={labelClass}>Ngày hết hạn ưu đãi</label>
            <input
              type="datetime-local"
              name="promotion_end"
              value={formData.promotion_end}
              onChange={handleChange}
              className={`${inputClass} disabled:opacity-50`}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:bg-blue-300"
          >
            {loading ? "Đang tạo..." : "Thêm Ngày khởi hành"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/tours/${id}/departures`)}
            className="flex-1 bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
