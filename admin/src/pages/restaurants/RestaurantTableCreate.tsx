import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function RestaurantTableEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [form, setForm] = useState({
    restaurant_id: "",
    name: "",
    capacity: "",
    quantity: "",
    price: "",
    discount_percent: 0,
    note: "",
  });

  useEffect(() => {
    const initData = async () => {
      await loadRestaurants();
      await loadTable();
    };
    initData();
  }, [id]);

  const loadTable = async () => {
    try {
      const tableId = id ? Number(id) : undefined;
      if (!tableId) throw new Error("ID không hợp lệ");

      const data = await RestaurantService.getTable(tableId);

      setForm({
        restaurant_id: data.restaurant_id || "",
        name: data.name || "",
        capacity: data.capacity || "",
        quantity: data.quantity || "",
        price: data.price || "",
        discount_percent: data.discount_percent || 0,
        note: data.note || "",
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bàn:", error);
      alert("Không thể tải thông tin bàn ăn");
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Lỗi tải danh sách nhà hàng:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const tableId = id ? Number(id) : undefined;
      if (!tableId) throw new Error("ID không hợp lệ");

      const payload = {
        ...form,
        restaurant_id: Number(form.restaurant_id),
        capacity: Number(form.capacity),
        quantity: Number(form.quantity),
        price: Math.round(Number(form.price)), // Đảm bảo là số nguyên
        discount_percent: Number(form.discount_percent),
      };

      await RestaurantService.updateTable(tableId, payload);
      alert("Cập nhật thông tin bàn thành công!");
      navigate("/admin/restaurant-tables");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Bàn ăn</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nhà hàng */}
          <div>
            <label className={labelClass}>Thuộc Nhà hàng</label>
            <select
              name="restaurant_id"
              value={form.restaurant_id}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">-- Chọn nhà hàng --</option>
              {restaurants.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tên loại bàn */}
          <div>
            <label className={labelClass}>Tên loại bàn (VD: Bàn 4 người)</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sức chứa */}
          <div>
            <label className={labelClass}>Sức chứa (người/bàn)</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Số lượng bàn */}
          <div>
            <label className={labelClass}>Số lượng bàn có sẵn</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Giá gốc */}
          <div>
            <label className={labelClass}>Giá đặt bàn (VNĐ)</label>
            <input
              type="number"
              name="price"
              step="1"
              value={form.price}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "." || e.key === ",") e.preventDefault();
              }}
              className={inputClass}
              required
            />
          </div>

          {/* Giảm giá */}
          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              type="number"
              name="discount_percent"
              value={form.discount_percent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className={labelClass}>Ghi chú / Mô tả bàn</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            placeholder="VD: Gần cửa sổ, view biển..."
            className={inputClass}
          />
        </div>

        {/* Nút bấm */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Cập nhật Bàn
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/restaurant-tables")}
            className="bg-white text-gray-600 border border-gray-200 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
