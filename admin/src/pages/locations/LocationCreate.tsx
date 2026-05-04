import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationService from "../../services/LocationService";

export default function LocationCreate() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<any[]>([]);

  const [form, setForm] = useState({
    country_id: "",
    name: "",
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
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Location</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* Country dropdown */}
        <select
          name="country_id"
          value={form.country_id}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        >
          <option value="">Chọn quốc gia</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Tên địa điểm"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />

        <textarea
          name="description"
          placeholder="Mô tả ngắn"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <textarea
          name="content"
          placeholder="Nội dung chi tiết"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="address"
          placeholder="Địa chỉ"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="province"
          placeholder="Tỉnh / Thành phố"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="lat"
          placeholder="Vĩ độ (Latitude)"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="lng"
          placeholder="Kinh độ (Longitude)"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="image_url"
          placeholder="Đường dẫn hình ảnh (URL)"
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            Tạo mới
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/locations")}
            className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
