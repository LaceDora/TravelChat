import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelService from "../../services/HotelService";

export default function RoomEdit() {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price_per_night: "",
    capacity: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    loadRoom();
  }, []);

  const loadRoom = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/hotel-rooms/${roomId}`,
      );
      const data = await res.json();

      setForm({
        name: data.name ?? "",
        // Làm tròn số tiền khi load từ database
        price_per_night: data.price_per_night
          ? Math.floor(data.price_per_night).toString()
          : "",
        capacity: data.capacity ? Math.floor(data.capacity).toString() : "",
        quantity: data.quantity ? Math.floor(data.quantity).toString() : "",
        description: data.description ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Cannot load room");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Chỉ cho phép nhập số nguyên cho Giá, Sức chứa và Số lượng
    if (["price_per_night", "capacity", "quantity"].includes(name)) {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await HotelService.updateRoom(Number(roomId), {
        hotel_id: Number(hotelId),
        name: form.name,
        price_per_night: Number(form.price_per_night),
        capacity: form.capacity !== "" ? Number(form.capacity) : null,
        quantity: form.quantity !== "" ? Number(form.quantity) : null,
        description: form.description || null,
      });

      alert("Room updated successfully");
      navigate(`/admin/hotels/${hotelId}/rooms`);
    } catch (err) {
      console.error(err);
      alert("Update room failed");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Room</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* NAME */}
        <div>
          <label className={labelClass}>Room Name</label>
          <input
            name="name"
            placeholder="Ex: Deluxe Double Room"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className={labelClass}>Price per night (VNĐ)</label>
          <input
            type="text"
            inputMode="numeric"
            name="price_per_night"
            placeholder="Ex: 1200000"
            value={form.price_per_night}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* CAPACITY */}
          <div>
            <label className={labelClass}>Capacity (People)</label>
            <input
              type="text"
              inputMode="numeric"
              name="capacity"
              placeholder="Ex: 2"
              value={form.capacity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className={labelClass}>Quantity (Rooms)</label>
            <input
              type="text"
              inputMode="numeric"
              name="quantity"
              placeholder="Ex: 5"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            placeholder="Room details..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update Room
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
