import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function RestaurantTableEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    restaurant_id: "",
    name: "",
    capacity: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      const tableId = id ? Number(id) : undefined;

      if (!tableId) {
        throw new Error("Invalid table ID");
      }

      const data = await RestaurantService.getTable(tableId);

      setForm({
        restaurant_id: data.restaurant_id || "",
        name: data.name || "",
        capacity: data.capacity || "",
        quantity: data.quantity || "",
        note: data.note || "",
      });
    } catch (error) {
      console.error("Load table failed:", error);
      alert("Failed to load table");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const tableId = id ? Number(id) : undefined;

      if (!tableId) {
        throw new Error("Invalid table ID");
      }

      await RestaurantService.updateTable(tableId, form);

      alert("Table updated successfully");

      navigate("/admin/restaurant-tables");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update table failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading table...</div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant Table</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Restaurant ID</label>

          <input
            name="restaurant_id"
            value={form.restaurant_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Table Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Capacity</label>

          <input
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>

          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Note</label>

          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Table
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/restaurant-tables")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
