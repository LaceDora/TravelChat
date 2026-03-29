import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TourService from "../../services/TourService";

interface Location {
  id: number;
  name: string;
}

export default function TourCreate() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    location_id: "",
    name: "",
    days: "",
    price: "",
    discount_percent: "",
    combo_content: "",
    description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Load locations failed:", err));
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    // Xử lý các trường nullable: nếu rỗng thì gửi null
    const payload = {
      ...formData,
      location_id: formData.location_id ? Number(formData.location_id) : null,
      days: formData.days ? Number(formData.days) : null,
      price: formData.price ? Number(formData.price) : null,
      discount_percent: formData.discount_percent ? Number(formData.discount_percent) : null,
      combo_content: formData.combo_content || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
    };

    try {
      await TourService.createTour(payload);
      alert("Tour created successfully!");
      navigate("/admin/tours");
    } catch (error) {
      console.error("Create tour failed:", error);
      alert("Failed to create tour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Tour</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">Location</label>

          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Location</option>

            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tour Name */}
        <div>
          <label className="block mb-1 font-medium">Tour Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Days */}
        <div>
          <label className="block mb-1 font-medium">Days</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-1 font-medium">Discount (%)</label>
          <input
            type="number"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Combo */}
        <div>
          <label className="block mb-1 font-medium">Combo Content</label>
          <textarea
            name="combo_content"
            value={formData.combo_content}
            onChange={handleChange}
            rows={3}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Tour"}
        </button>
      </form>
    </div>
  );
}
