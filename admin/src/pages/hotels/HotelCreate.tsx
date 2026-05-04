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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Hotel</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* ĐỊA ĐIỂM */}
        <select
          name="location_id"
          value={form.location_id}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        >
          <option value="">Chọn địa điểm</option>

          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        {/* TÊN KHÁCH SẠN */}
        <input
          name="name"
          placeholder="Tên khách sạn"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />

        {/* ĐÁNH GIÁ */}
        <input
          name="rating"
          placeholder="Xếp hạng (1 - 5 sao)"
          value={form.rating}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        {/* GIÁ PHÒNG */}
        <input
          name="price_per_night"
          placeholder="Giá mỗi đêm"
          value={form.price_per_night}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />

        {/* GIẢM GIÁ */}
        <input
          name="discount_percent"
          placeholder="Phần trăm giảm giá (%)"
          value={form.discount_percent}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        {/* ĐỊA CHỈ */}
        <input
          name="address"
          placeholder="Địa chỉ cụ thể"
          value={form.address}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <label className="block mb-1.5 text-sm font-semibold text-gray-700">
          Đường dẫn ảnh (URL)
        </label>
        <input
          name="image_url"
          placeholder="Nhập link ảnh tại đây"
          value={form.image_url}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {form.image_url && (
          <div className="my-2 text-center">
            <img
              src={form.image_url}
              alt="xem trước"
              className="w-48 rounded shadow mx-auto"
            />
          </div>
        )}

        {/* TỌA ĐỘ */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="lat"
            placeholder="Vĩ độ (Lat)"
            value={form.lat}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />

          <input
            name="lng"
            placeholder="Kinh độ (Lng)"
            value={form.lng}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* NỘI DUNG COMBO */}
        <textarea
          name="combo_content"
          placeholder="Nội dung gói Combo (nếu có)"
          value={form.combo_content}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        {/* MÔ TẢ */}
        <textarea
          name="description"
          placeholder="Mô tả khách sạn"
          value={form.description}
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
            onClick={() => navigate("/admin/hotels")}
            className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
