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
        price_per_night: data.price_per_night ?? "",
        capacity: data.capacity ?? "",
        quantity: data.quantity ?? "",
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await HotelService.updateRoom(Number(roomId), {
        hotel_id: Number(hotelId),
        name: form.name,
        price_per_night: Number(form.price_per_night),
        capacity:
          form.capacity !== undefined && form.capacity !== ""
            ? Number(form.capacity)
            : null,
        quantity:
          form.quantity !== undefined && form.quantity !== ""
            ? Number(form.quantity)
            : null,
        description: form.description || null,
      });

      alert("Room updated successfully");

      navigate(`/admin/hotels/${hotelId}/rooms`);
    } catch (err) {
      console.error(err);
      alert("Update room failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Room</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          name="name"
          placeholder="Room name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* PRICE */}
        <input
          name="price_per_night"
          placeholder="Price per night"
          value={form.price_per_night}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* CAPACITY */}
        <input
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* QUANTITY */}
        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
