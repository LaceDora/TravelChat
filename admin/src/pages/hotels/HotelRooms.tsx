import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelService from "../../services/HotelService";

interface Room {
  id: number;
  name: string;
  price_per_night: number;
  capacity: number;
  quantity: number;
  description?: string;
}

export default function HotelRooms() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    price_per_night: "",
    capacity: "2",
    quantity: "1",
    description: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      if (!hotelId) return;
      const data = await HotelService.getRoomsByHotel(Number(hotelId));
      setRooms(data);
    } catch (err) {
      console.error(err);
      alert("Cannot load rooms");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Chặn nhập ký tự không phải số cho các trường định lượng
    if (["price_per_night", "capacity", "quantity"].includes(name)) {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      price_per_night: "",
      capacity: "2",
      quantity: "1",
      description: "",
    });
    setEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        hotel_id: Number(hotelId),
        name: form.name,
        price_per_night: Number(form.price_per_night),
        capacity: form.capacity !== "" ? Number(form.capacity) : 2,
        quantity: form.quantity !== "" ? Number(form.quantity) : 1,
        description: form.description || null,
      };

      if (editing) {
        await HotelService.updateRoom(form.id, payload);
        alert("Room updated");
      } else {
        await HotelService.createRoom(payload);
        alert("Room created");
      }

      resetForm();
      loadRooms();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleEdit = (room: Room) => {
    setEditing(true);
    setForm({
      id: room.id,
      name: room.name,
      // Dùng Math.floor để đảm bảo không hiển thị .00 khi đưa vào input
      price_per_night: room.price_per_night
        ? Math.floor(room.price_per_night).toString()
        : "",
      capacity: room.capacity ? Math.floor(room.capacity).toString() : "2",
      quantity: room.quantity ? Math.floor(room.quantity).toString() : "1",
      description: room.description || "",
    });
    // Cuộn lên đầu để người dùng thấy form edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this room?")) return;

    try {
      await HotelService.deleteRoom(id);
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">
        Quản lý Phòng Khách sạn
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-5"
      >
        <h2 className="font-bold text-lg text-blue-600">
          {editing ? "📝 Chỉnh sửa phòng" : "➕ Thêm phòng mới"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 ml-1">
              Tên phòng
            </label>
            <input
              name="name"
              placeholder="VD: Phòng Deluxe Hướng Biển"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 ml-1">
              Giá/đêm (VNĐ)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="price_per_night"
              placeholder="VD: 1500000"
              value={form.price_per_night}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 ml-1">
              Sức chứa (Người)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="capacity"
              placeholder="Mặc định: 2"
              value={form.capacity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 ml-1">
              Số lượng phòng hiện có
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="quantity"
              placeholder="Mặc định: 1"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 ml-1">
            Mô tả phòng
          </label>
          <textarea
            name="description"
            placeholder="Mô tả tiện nghi phòng..."
            value={form.description}
            onChange={handleChange}
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            {editing ? "Cập nhật" : "Tạo phòng"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Hủy sửa
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/admin/hotels")}
            className="bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-700">Danh sách phòng hiện có</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                <th className="px-5 py-3.5 text-left">STT</th>
                <th className="px-5 py-3.5 text-left">Tên phòng</th>
                <th className="px-5 py-3.5 text-right">Giá/đêm</th>
                <th className="px-5 py-3.5 text-center">Sức chứa</th>
                <th className="px-5 py-3.5 text-center">Số lượng</th>
                <th className="px-5 py-3.5 text-left">Mô tả</th>
                <th className="px-5 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {rooms.map((room, idx) => (
                <tr
                  key={room.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                    {room.name}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-blue-600 text-right">
                    {new Intl.NumberFormat("vi-VN").format(
                      Math.floor(room.price_per_night || 0),
                    )}{" "}
                    VNĐ
                  </td>
                  <td className="px-5 py-4 text-sm text-center text-gray-600">
                    {room.capacity} người
                  </td>
                  <td className="px-5 py-4 text-sm text-center text-gray-600">
                    {room.quantity}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {room.description || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition-colors text-xs"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition-colors text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rooms.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-8 text-gray-400 italic"
                  >
                    Chưa có phòng nào được tạo cho khách sạn này.
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
