import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationService from "../../services/LocationService";

export default function LocationCreate() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<any[]>([]);

  const [form, setForm] = useState({
    country_id: "",
    name: "",
    type: "",
    description: "",
    content: "",
    address: "",
    province: "",
    lat: "",
    lng: "",
    image_url: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
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
      await LocationService.createLocation({
        ...form,
        country_id: Number(form.country_id),
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      });

      alert("Create location success");
      navigate("/admin/locations");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Create Location</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country dropdown */}
        <select
          name="country_id"
          value={form.country_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Location Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="type"
          placeholder="Type (beach, mountain, city...)"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="content"
          placeholder="Content"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="province"
          placeholder="Province"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="lat"
          placeholder="Latitude"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="lng"
          placeholder="Longitude"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="image_url"
          placeholder="Image URL"
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
            onClick={() => navigate("/admin/locations")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
