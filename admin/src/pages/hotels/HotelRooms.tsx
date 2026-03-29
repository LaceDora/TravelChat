import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
        capacity:
          form.capacity !== undefined && form.capacity !== ""
            ? Number(form.capacity)
            : null,
        quantity:
          form.quantity !== undefined && form.quantity !== ""
            ? Number(form.quantity)
            : null,
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
      price_per_night: String(room.price_per_night),
      capacity: String(room.capacity),
      quantity: String(room.quantity),
      description: room.description || "",
    });
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hotel Rooms</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded mb-6 space-y-3"
      >
        <h2 className="font-semibold">
          {editing ? "Edit Room" : "Create Room"}
        </h2>

        <input
          name="name"
          placeholder="Room name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price_per_night"
          placeholder="Price per night"
          value={form.price_per_night}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="border p-2">{room.id}</td>

              <td className="border p-2">{room.name}</td>

              <td className="border p-2">${room.price_per_night}</td>

              <td className="border p-2">{room.capacity}</td>

              <td className="border p-2">{room.quantity}</td>

              <td className="border p-2">{room.description}</td>

              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rooms.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No rooms found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
