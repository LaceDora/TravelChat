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
    <div className="p-6 max-w-xl mx-auto space-y-6">
      {" "}
      <h1 className="text-2xl font-bold text-gray-800">Edit Location</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* QUỐC GIA */}
        <select
          name="country_id"
          value={form.country_id}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        >
          <option value="">Chọn Quốc gia</option>
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
          placeholder="Tên địa điểm"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Nội dung chi tiết"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="province"
          value={form.province}
          onChange={handleChange}
          placeholder="Tỉnh/Thành phố"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="lat"
          value={form.lat}
          onChange={handleChange}
          placeholder="Vĩ độ (Latitude)"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="lng"
          value={form.lng}
          onChange={handleChange}
          placeholder="Kinh độ (Longitude)"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Đường dẫn ảnh (URL)"
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            Cập nhật
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/locations")}
            className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
