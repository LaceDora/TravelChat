import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelService from "../../services/HotelService";

export default function RoomCreate() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price_per_night: "",
    capacity: "2",
    quantity: "1",
    description: "",
  });

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
      await HotelService.createRoom({
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

      alert("Room created successfully");

      navigate(`/admin/hotels/${hotelId}/rooms`);
    } catch (err) {
      console.error(err);
      alert("Create room failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create Room</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ROOM NAME */}
        <input
          name="name"
          placeholder="Room Name (Single, Double, Deluxe...)"
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
          placeholder="Capacity (people)"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* QUANTITY */}
        <input
          name="quantity"
          placeholder="Number of rooms"
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
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
