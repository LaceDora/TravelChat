import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationService from "../../services/LocationService";

export default function LocationEdit() {
  const { id } = useParams();
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

  // lấy danh sách country
  const fetchCountries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/countries");
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error(err);
    }
  };

  // lấy location để edit
  const fetchLocation = async () => {
    try {
      const data = await LocationService.getLocation(Number(id));

      setForm({
        country_id: data.country_id ? String(data.country_id) : "",
        name: data.name || "",
        type: data.type || "",
        description: data.description || "",
        content: data.content || "",
        address: data.address || "",
        province: data.province || "",
        lat: data.lat ? String(data.lat) : "",
        lng: data.lng ? String(data.lng) : "",
        image_url: data.image_url || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCountries();
    if (id) fetchLocation();
  }, [id]);

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
      await LocationService.updateLocation(Number(id), {
        ...form,
        country_id: Number(form.country_id),
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      });

      alert("Update success");
      navigate("/admin/locations");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      {" "}
      <h1 className="text-2xl font-semibold mb-6">Edit Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* COUNTRY */}
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
          value={form.name}
          onChange={handleChange}
          placeholder="Location Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Type (beach, mountain, city...)"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded"
        />

        <input
          name="province"
          value={form.province}
          onChange={handleChange}
          placeholder="Province"
          className="w-full border p-2 rounded"
        />

        <input
          name="lat"
          value={form.lat}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-full border p-2 rounded"
        />

        <input
          name="lng"
          value={form.lng}
          onChange={handleChange}
          placeholder="Longitude"
          className="w-full border p-2 rounded"
        />

        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
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
