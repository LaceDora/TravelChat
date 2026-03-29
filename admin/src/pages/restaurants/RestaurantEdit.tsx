import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

export default function RestaurantEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState<any[]>([]);

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
    loadRestaurant();
    loadLocations();
  }, []);

  const loadRestaurant = async () => {
    try {
      const restaurantId = id ? Number(id) : undefined;

      if (!restaurantId || isNaN(restaurantId)) {
        throw new Error("Invalid restaurant ID");
      }

      const data = await RestaurantService.getRestaurant(restaurantId);

      setForm({
        location_id: data.location_id || "",
        name: data.name || "",
        description: data.description || "",
        menu_content: data.menu_content || "",
        image_url: data.image_url || "",
        avg_price: data.avg_price || "",
        discount_percent: data.discount_percent || 0,
        address: data.address || "",
        lat: data.lat || "",
        lng: data.lng || "",
      });
    } catch (error) {
      console.error("Load restaurant failed:", error);
      alert("Load restaurant failed");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const data = await RestaurantService.getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Load locations failed:", error);
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
      const restaurantId = id ? Number(id) : undefined;

      if (!restaurantId || isNaN(restaurantId)) {
        throw new Error("Invalid restaurant ID");
      }

      await RestaurantService.updateRestaurant(restaurantId, form);

      alert("Restaurant updated successfully");

      navigate("/admin/restaurants");
    } catch (error) {
      console.error("Update restaurant failed:", error);
      alert("Update restaurant failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading restaurant...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant</h1>

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

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">Location</label>

          <select
            name="location_id"
            value={form.location_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Select Location --</option>

            {locations.map((loc: any) => (
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

          {form.image_url && (
            <img
              src={form.image_url}
              alt="preview"
              className="mt-3 w-60 rounded border"
            />
          )}
        </div>

        {/* Avg price */}
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
            Update Restaurant
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
