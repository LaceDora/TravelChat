import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

interface Location {
  id: number;
  name: string;
}

export default function RestaurantCreate() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    location_id: "",
    name: "",
    description: "",
    menu_content: "",
    image_url: "",
    avg_price: "",
    discount_percent: 0,
    address: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Load locations failed", err));
  }, []);

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
      await RestaurantService.createRestaurant(form);
      alert("Restaurant created successfully");
      navigate("/admin/restaurants");
    } catch (error) {
      console.error("Create restaurant failed:", error);
      alert("Create restaurant failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Add Restaurant</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Location Select */}
        <div>
          <label className="block mb-1 font-medium">Location</label>

          <select
            name="location_id"
            value={form.location_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Location</option>

            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Avg Price */}
        <div>
          <label className="block mb-1 font-medium">Average Price</label>
          <input
            name="avg_price"
            value={form.avg_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-1 font-medium">Discount (%)</label>
          <input
            type="number"
            name="discount_percent"
            value={form.discount_percent}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block mb-1 font-medium">Latitude</label>
          <input
            name="lat"
            value={form.lat}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block mb-1 font-medium">Longitude</label>
          <input
            name="lng"
            value={form.lng}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Menu */}
        <div>
          <label className="block mb-1 font-medium">Menu Content</label>
          <textarea
            name="menu_content"
            value={form.menu_content}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Restaurant
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/restaurants")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
