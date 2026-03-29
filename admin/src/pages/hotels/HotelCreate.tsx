import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HotelService from "../../services/HotelService";

export default function HotelCreate() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<any[]>([]);

  const [form, setForm] = useState({
    location_id: "",
    name: "",
    rating: "",
    price_per_night: "",
    discount_percent: "0",
    combo_content: "",
    description: "",
    image_url: "",
    address: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await HotelService.createHotel({
        ...form,
        location_id: form.location_id ? Number(form.location_id) : null,
        rating:
          form.rating !== undefined && form.rating !== ""
            ? Number(form.rating)
            : null,
        price_per_night: Number(form.price_per_night),
        discount_percent:
          form.discount_percent !== undefined && form.discount_percent !== ""
            ? Number(form.discount_percent)
            : null,
        lat:
          form.lat !== undefined && form.lat !== "" ? Number(form.lat) : null,
        lng:
          form.lng !== undefined && form.lng !== "" ? Number(form.lng) : null,
      });

      alert("Create hotel success");

      navigate("/admin/hotels");
    } catch (err) {
      console.error(err);
      alert("Create hotel failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Create Hotel</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* LOCATION */}
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

        {/* NAME */}
        <input
          name="name"
          placeholder="Hotel Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* RATING */}
        <input
          name="rating"
          placeholder="Rating (1 - 5)"
          value={form.rating}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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

        {/* DISCOUNT */}
        <input
          name="discount_percent"
          placeholder="Discount percent"
          value={form.discount_percent}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* ADDRESS */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="block font-medium mb-1">Image URL</label>
        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {form.image_url && (
          <div className="my-2 text-center">
            <img
              src={form.image_url}
              alt="preview"
              className="w-48 rounded shadow mx-auto"
            />
          </div>
        )}

        {/* LAT */}
        <input
          name="lat"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* LNG */}
        <input
          name="lng"
          placeholder="Longitude"
          value={form.lng}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* COMBO CONTENT */}
        <textarea
          name="combo_content"
          placeholder="Combo Content"
          value={form.combo_content}
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
            onClick={() => navigate("/admin/hotels")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
