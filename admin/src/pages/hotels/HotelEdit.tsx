import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelService from "../../services/HotelService";

export default function HotelEdit() {
  const { id } = useParams();
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
    loadLocations();
    loadHotel();
  }, []);

  const loadLocations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/locations");
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHotel = async () => {
    try {
      if (!id) return;

      const data = await HotelService.getHotel(Number(id));

      setForm({
        location_id: data.location_id ?? "",
        name: data.name ?? "",
        rating: data.rating ?? "",
        // Loại bỏ số lẻ khi load dữ liệu lên form
        price_per_night: data.price_per_night
          ? Math.floor(data.price_per_night).toString()
          : "",
        discount_percent: data.discount_percent
          ? Math.floor(data.discount_percent).toString()
          : "0",
        combo_content: data.combo_content ?? "",
        description: data.description ?? "",
        image_url: data.image_url ?? "",
        address: data.address ?? "",
        lat: data.lat ?? "",
        lng: data.lng ?? "",
      });
    } catch (err) {
      console.error(err);
      alert("Cannot load hotel");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Chặn nhập ký tự lạ, chỉ cho phép nhập số nguyên cho giá và giảm giá
    if (name === "price_per_night" || name === "discount_percent") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!id) return;

      await HotelService.updateHotel(Number(id), {
        ...form,
        location_id: form.location_id ? Number(form.location_id) : null,
        rating: form.rating !== "" ? Number(form.rating) : null,
        price_per_night: Number(form.price_per_night),
        discount_percent:
          form.discount_percent !== "" ? Number(form.discount_percent) : 0,
        lat: form.lat !== "" ? Number(form.lat) : null,
        lng: form.lng !== "" ? Number(form.lng) : null,
      });

      alert("Update hotel success");
      navigate("/admin/hotels");
    } catch (err) {
      console.error(err);
      alert("Update hotel failed");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Hotel</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* ĐỊA ĐIỂM */}
        <div>
          <label className={labelClass}>Địa điểm</label>
          <select
            name="location_id"
            value={form.location_id}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Chọn địa điểm</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* TÊN KHÁCH SẠN */}
        <div>
          <label className={labelClass}>Tên khách sạn</label>
          <input
            name="name"
            placeholder="Nhập tên khách sạn"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* GIÁ PHÒNG */}
          <div>
            <label className={labelClass}>Giá mỗi đêm (VNĐ)</label>
            <input
              type="text"
              inputMode="numeric"
              name="price_per_night"
              placeholder="VD: 500000"
              value={form.price_per_night}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          {/* GIẢM GIÁ */}
          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              type="text"
              inputMode="numeric"
              name="discount_percent"
              placeholder="VD: 10"
              value={form.discount_percent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ĐÁNH GIÁ */}
        <div>
          <label className={labelClass}>Xếp hạng (Sao)</label>
          <input
            name="rating"
            type="number"
            step="0.1"
            placeholder="VD: 4.5"
            value={form.rating}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* ĐỊA CHỈ */}
        <div>
          <label className={labelClass}>Địa chỉ cụ thể</label>
          <input
            name="address"
            placeholder="Số nhà, tên đường..."
            value={form.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* HÌNH ẢNH */}
        <div>
          <label className={labelClass}>Đường dẫn ảnh (URL)</label>
          <input
            name="image_url"
            placeholder="Dán link ảnh tại đây"
            value={form.image_url}
            onChange={handleChange}
            className={inputClass}
          />
          {form.image_url && (
            <div className="mt-3 text-center">
              <img
                src={form.image_url}
                alt="Xem trước ảnh"
                className="w-32 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
              />
            </div>
          )}
        </div>

        {/* TỌA ĐỘ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vĩ độ (Lat)</label>
            <input
              name="lat"
              placeholder="Vĩ độ"
              value={form.lat}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kinh độ (Lng)</label>
            <input
              name="lng"
              placeholder="Kinh độ"
              value={form.lng}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* NỘI DUNG COMBO */}
        <div>
          <label className={labelClass}>Nội dung Combo</label>
          <textarea
            name="combo_content"
            placeholder="Combo bao gồm những gì?"
            value={form.combo_content}
            onChange={handleChange}
            rows={2}
            className={inputClass}
          />
        </div>

        {/* MÔ TẢ */}
        <div>
          <label className={labelClass}>Mô tả khách sạn</label>
          <textarea
            name="description"
            placeholder="Giới thiệu chung về khách sạn..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* NÚT BẤM */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Cập nhật khách sạn
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/hotels")}
            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
