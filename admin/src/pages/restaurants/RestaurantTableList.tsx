import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

interface Table {
  id: number;
  restaurant_id: number;
  name: string;
  capacity: number;
  quantity: number;
  price: number;
  discount_percent: number;
  note?: string;
}

export default function RestaurantTableCreate() {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurantIdNum = restaurantId ? Number(restaurantId) : null;

  const [tables, setTables] = useState<Table[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    restaurant_id: restaurantId || "",
    name: "",
    capacity: "",
    quantity: "1",
    price: "",
    discount_percent: "0",
    note: "",
  });

  useEffect(() => {
    if (restaurantIdNum) {
      loadTables(restaurantIdNum);
    }
    setLoading(false);
  }, [restaurantIdNum]);

  const loadTables = async (id: number) => {
    try {
      const data = await RestaurantService.getTablesByRestaurant(id);
      setTables(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bàn:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Chỉ cho phép nhập số nguyên cho các trường dữ liệu số
    if (["capacity", "quantity", "price", "discount_percent"].includes(name)) {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm({ ...form, [name]: onlyNumbers });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      restaurant_id: restaurantId || "",
      name: "",
      capacity: "",
      quantity: "1",
      price: "",
      discount_percent: "0",
      note: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantIdNum) return alert("Không tìm thấy mã nhà hàng");

    try {
      const payload = {
        ...form,
        restaurant_id: restaurantIdNum,
        capacity: Number(form.capacity),
        quantity: Number(form.quantity),
        price: Math.round(Number(form.price)),
        discount_percent: Number(form.discount_percent),
      };

      if (editingId) {
        await RestaurantService.updateTable(editingId, payload);
        alert("Cập nhật loại bàn thành công!");
      } else {
        await RestaurantService.createTable(payload);
        alert("Thêm loại bàn mới thành công!");
      }

      resetForm();
      loadTables(restaurantIdNum);
    } catch (err) {
      console.error("Lỗi lưu dữ liệu:", err);
      alert("Lỗi: Không thể lưu thông tin.");
    }
  };

  const handleEdit = (table: Table) => {
    setEditingId(table.id);
    setForm({
      restaurant_id: String(table.restaurant_id),
      name: table.name,
      capacity: String(Math.floor(table.capacity)),
      quantity: String(Math.floor(table.quantity)),
      price: String(Math.floor(table.price || 0)),
      discount_percent: String(Math.floor(table.discount_percent || 0)),
      note: table.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa loại bàn này?")) return;
    try {
      await RestaurantService.deleteTable(id);
      if (restaurantIdNum) loadTables(restaurantIdNum);
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass =
    "block mb-1 text-xs font-semibold text-gray-500 uppercase ml-1";

  if (loading)
    return <div className="p-6 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bàn ăn</h1>
        <button
          onClick={() => navigate("/admin/restaurants")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại nhà hàng
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-6 rounded-full ${editingId ? "bg-amber-400" : "bg-blue-600"}`}
          ></div>
          <h2 className="text-lg font-bold text-gray-700">
            {editingId ? "Chỉnh sửa loại bàn" : "Thêm loại bàn mới"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Tên loại bàn</label>
            <input
              name="name"
              placeholder="VD: Bàn VIP, Bàn ngoài trời..."
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Sức chứa (Người)</label>
            <input
              name="capacity"
              type="text"
              inputMode="numeric"
              placeholder="Số người"
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
              type="text"
              inputMode="numeric"
              placeholder="Số bàn"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giá đặt bàn (VNĐ)</label>
            <input
              name="price"
              type="text"
              inputMode="numeric"
              placeholder="Nhập giá (VD: 300000)"
              value={form.price}
              onChange={handleChange}
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
          <label className={labelClass}>Ghi chú</label>
          <textarea
            name="note"
            placeholder="Mô tả thêm..."
            value={form.note}
            onChange={handleChange}
            className={inputClass}
            rows={2}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
          >
            {editingId ? "Cập nhật" : "Tạo mới"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-200"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      {/* Table List Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-gray-700">
            Danh sách các loại bàn hiện tại
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-50">
                <th className="px-6 py-4">STT</th>
                <th className="px-6 py-4">Tên bàn</th>
                <th className="px-6 py-4 text-center">Sức chứa</th>
                <th className="px-6 py-4 text-center">Số lượng</th>
                <th className="px-6 py-4 text-right">Giá bán</th>
                <th className="px-6 py-4 text-center">Giảm giá</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tables.map((table, index) => (
                <tr
                  key={table.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {table.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {table.capacity} người
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {table.quantity} bàn
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right">
                    {new Intl.NumberFormat("vi-VN").format(
                      Math.floor(table.price || 0),
                    )}{" "}
                    VNĐ
                  </td>
                  <td className="px-6 py-4 text-sm text-red-500 text-center">
                    {table.discount_percent}%
                  </td>
                  <td className="px-6 py-4 text-sm flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(table)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-400 italic"
                  >
                    Chưa có loại bàn nào được tạo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
