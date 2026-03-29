import { useEffect, useState } from "react";
import RestaurantService from "../../services/RestaurantService";

interface Restaurant {
  id: number;
  name: string;
}

interface Table {
  id: number;
  restaurant_id: number;
  name: string;
  capacity: number;
  quantity: number;
  note?: string;
}

export default function RestaurantTableCreate() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  const [restaurantId, setRestaurantId] = useState<number | "">("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    restaurant_id: "",
    name: "",
    capacity: "",
    quantity: "1",
    note: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Load restaurants failed", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async (id: number) => {
    try {
      const data = await RestaurantService.getTablesByRestaurant(id);
      setTables(data);
    } catch (err) {
      console.error("Load tables failed", err);
    }
  };

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);

    setRestaurantId(id);

    setForm({
      ...form,
      restaurant_id: String(id),
    });

    loadTables(id);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      restaurant_id: String(restaurantId),
      name: "",
      capacity: "",
      quantity: "1",
      note: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurantId) {
      alert("Please select a restaurant");
      return;
    }

    try {
      if (editingId) {
        await RestaurantService.updateTable(editingId, form);
        alert("Table updated");
      } else {
        await RestaurantService.createTable(form);
        alert("Table created");
      }

      resetForm();
      loadTables(Number(restaurantId));
    } catch (err) {
      console.error("Save table failed", err);
      alert("Save failed");
    }
  };

  const handleEdit = (table: Table) => {
    setEditingId(table.id);

    setForm({
      restaurant_id: String(table.restaurant_id),
      name: table.name,
      capacity: String(table.capacity),
      quantity: String(table.quantity),
      note: table.note || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this table?")) return;

    try {
      await RestaurantService.deleteTable(id);
      loadTables(Number(restaurantId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Restaurant Tables</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Restaurant</label>

        <select
          value={restaurantId}
          onChange={handleRestaurantChange}
          className="border p-2 rounded w-80"
        >
          <option value="">-- Select Restaurant --</option>

          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {restaurantId && (
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded mb-6 space-y-4 bg-white"
        >
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Table" : "Add Table"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Table Name (VIP, Couple...)"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <textarea
              name="note"
              placeholder="Note"
              value={form.note}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update Table" : "Create Table"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {tables.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Capacity</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Note</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td className="border p-2">{table.id}</td>
                <td className="border p-2">{table.name}</td>
                <td className="border p-2">{table.capacity}</td>
                <td className="border p-2">{table.quantity}</td>
                <td className="border p-2">{table.note}</td>

                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(table)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(table.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
