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
    discount_percent: "0",
    note: "",
  });

  useEffect(() => {
    const initData = async () => {
      await loadRestaurants();
      await loadTable();
    };
    initData();
  }, [id]);

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Lỗi tải danh sách nhà hàng:", error);
    }
  };

  const loadTable = async () => {
    try {
      const tableId = id ? Number(id) : undefined;
      if (!tableId || isNaN(tableId)) throw new Error("ID không hợp lệ");

      const data = await RestaurantService.getTable(tableId);

      setForm({
        restaurant_id: data.restaurant_id || "",
        name: data.name || "",
        capacity: data.capacity || "",
        quantity: data.quantity || "",
        // Ép kiểu về số nguyên và chuyển thành chuỗi để input text hiển thị sạch
        price: data.price ? Math.floor(Number(data.price)).toString() : "",
        discount_percent: data.discount_percent
          ? Math.floor(Number(data.discount_percent)).toString()
          : "0",
        note: data.note || "",
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bàn:", error);
      alert("Không thể tải thông tin bàn ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Nếu là ô price hoặc discount_percent, chỉ cho phép nhập số (loại bỏ mọi ký tự khác)
    if (name === "price" || name === "discount_percent") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tableId = id ? Number(id) : undefined;
      if (!tableId || isNaN(tableId)) throw new Error("ID không hợp lệ");

      const payload = {
        ...form,
        restaurant_id: Number(form.restaurant_id),
        capacity: Number(form.capacity),
        quantity: Number(form.quantity),
        price: Math.round(Number(form.price)),
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
  const labelClass =
    "block mb-1 text-xs font-semibold text-gray-500 uppercase ml-1";

  if (loading)
    return <div className="p-6 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Bàn ăn</h1>
        <button
          onClick={() => navigate("/admin/restaurant-tables")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại danh sách
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className={labelClass}>Tên loại bàn</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Bàn VIP"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sức chứa (Người)</label>
            <input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Số lượng bàn</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Đã chuyển sang type="text" để triệt tiêu dấu phẩy ,00 */}
          <div>
            <label className={labelClass}>Giá đặt bàn (VNĐ)</label>
            <input
              name="price"
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={handleChange}
              placeholder="Nhập giá (VD: 300000)"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              name="discount_percent"
              type="text"
              inputMode="numeric"
              value={form.discount_percent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Ghi chú / Mô tả</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className={inputClass}
            rows={3}
            placeholder="Mô tả thêm về loại bàn này..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
          >
            Lưu thay đổi
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/restaurant-tables")}
            className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
