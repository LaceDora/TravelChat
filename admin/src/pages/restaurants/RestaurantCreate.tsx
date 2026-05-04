import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

interface Location {
  id: number;
  name: string;
}

export default function RestaurantCreate() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    location_id: "",
    name: "",
    min_price: "",
    max_price: "",
    discount_percent: 0,
    promotion_end: "",
    description: "",
    menu_content: "", // Nhập liệu dạng: Tên món - Giá
    amenities: "",
    image_url: "",
    address: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Lỗi khi tải danh sách địa điểm:", err));
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let val: any = value;
    if (type === "number") val = value === "" ? "" : Number(value);
    if (type === "checkbox") val = checked;

    setForm({
      ...form,
      [name]: val,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // LOGIC QUAN TRỌNG: Chuyển đổi văn bản thành mảng Object [{name, price}]
      const menuArray = form.menu_content
        ? form.menu_content
            .split("\n") // Tách từng dòng
            .filter((line) => line.trim() !== "") // Loại bỏ dòng trống
            .map((line) => {
              const [name, price] = line.split("-"); // Tách tên và giá bằng dấu "-"
              return {
                name: name ? name.trim() : "Món chưa đặt tên",
                price: price ? Number(price.trim().replace(/[^0-9]/g, "")) : 0, // Chỉ lấy số
              };
            })
        : [];

      const payload = {
        ...form,
        location_id: form.location_id ? Number(form.location_id) : null,
        min_price: form.min_price ? Number(form.min_price) : null,
        max_price: form.max_price ? Number(form.max_price) : null,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,

        // Gửi thực đơn đã cấu trúc lại
        menu: menuArray,

        amenities: form.amenities
          ? form.amenities.split(",").map((i) => i.trim())
          : [],
        is_promotion: form.discount_percent > 0 || !!form.promotion_end,
      };

      await RestaurantService.createRestaurant(payload);
      alert("Thêm nhà hàng thành công!");
      navigate("/admin/restaurants");
    } catch (error) {
      console.error("Lỗi khi tạo nhà hàng:", error);
      alert("Thêm nhà hàng thất bại!");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Thêm Nhà Hàng Mới</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        {/* Tên nhà hàng */}
        <div>
          <label className={labelClass}>Tên nhà hàng</label>
          <input
            name="name"
            placeholder="Nhập tên nhà hàng..."
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Địa điểm */}
        <div>
          <label className={labelClass}>Khu vực/Địa điểm</label>
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

        {/* Giá cả */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giá thấp nhất (VNĐ)</label>
            <input
              type="number"
              name="min_price"
              placeholder="VD: 50000"
              value={form.min_price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Giá cao nhất (VNĐ)</label>
            <input
              type="number"
              name="max_price"
              placeholder="VD: 500000"
              value={form.max_price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Khuyến mãi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              type="number"
              name="discount_percent"
              value={form.discount_percent}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Ngày kết thúc khuyến mãi</label>
            <input
              type="date"
              name="promotion_end"
              value={form.promotion_end}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Hình ảnh & Địa chỉ */}
        <div>
          <label className={labelClass}>Đường dẫn ảnh (URL)</label>
          <input
            name="image_url"
            placeholder="https://example.com/image.jpg"
            value={form.image_url}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Địa chỉ chi tiết</label>
          <input
            name="address"
            placeholder="Số nhà, tên đường, quận/huyện..."
            value={form.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Tọa độ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vĩ độ (Latitude)</label>
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="VD: 10.762622"
              value={form.lat}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Kinh độ (Longitude)</label>
            <input
              type="number"
              step="any"
              name="lng"
              placeholder="VD: 106.660172"
              value={form.lng}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className={labelClass}>Mô tả nhà hàng</label>
          <textarea
            name="description"
            placeholder="Giới thiệu sơ lược về nhà hàng..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* Thực đơn */}
        <div>
          <label className={labelClass}>
            Nội dung thực đơn (Định dạng: Tên món - Giá tiền)
          </label>
          <textarea
            name="menu_content"
            placeholder="VD:&#10;Tôm hùm xanh hấp - 750000&#10;Ghẹ xanh loại 1 - 450000"
            value={form.menu_content}
            onChange={handleChange}
            rows={5}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-gray-500 italic">
            * Mỗi món nhập 1 dòng theo đúng cấu trúc: Tên món - Giá tiền
          </p>
        </div>

        {/* Tiện ích */}
        <div>
          <label className={labelClass}>
            Tiện ích (cách nhau bằng dấu phẩy)
          </label>
          <input
            name="amenities"
            placeholder="Wifi, Chỗ đậu xe, Máy lạnh..."
            value={form.amenities}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Nút bấm */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Tạo Nhà Hàng
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/restaurants")}
            className="bg-white text-gray-600 border border-gray-200 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
