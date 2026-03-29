import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

interface Location {
  id: number;
  name: string;
}

export default function TourEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadLocations();

    if (id) {
      fetchTour();
    }
  }, [id]);

  async function loadLocations() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/locations");
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Load locations failed:", err);
    }
  }

  async function fetchTour() {
    try {
      const data = await TourService.getTour(Number(id));

      setFormData({
        location_id: data.location_id?.toString() || "",
        name: data.name || "",
        days: data.days?.toString() || "",
        price: data.price?.toString() || "",
        discount_percent: data.discount_percent?.toString() || "",
        combo_content: data.combo_content || "",
        description: data.description || "",
        image_url: data.image_url || "",
      });
    } catch (error) {
      console.error("Load tour failed:", error);
      alert("Failed to load tour");
    } finally {
      setLoading(false);
    }
  }

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

    if (!id) return;

    setSaving(true);

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
      await TourService.updateTour(Number(id), payload);
      alert("Tour updated successfully!");
      navigate("/admin/tours");
    } catch (error) {
      console.error("Update tour failed:", error);
      alert("Failed to update tour");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading tour...</p>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Tour</h1>

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
          disabled={saving}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          {saving ? "Updating..." : "Update Tour"}
        </button>
      </form>
    </div>
  );
}
