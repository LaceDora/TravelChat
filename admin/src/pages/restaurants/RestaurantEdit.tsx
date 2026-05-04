import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantService from "../../services/RestaurantService";

interface Location {
  id: number;
  name: string;
}

export default function RestaurantEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    location_id: "",
    name: "",
    min_price: "",
    max_price: "",
    discount_percent: "0", // Chuyển về string để đồng bộ với input text
    promotion_end: "",
    description: "",
    menu_content: "",
    amenities: "",
    image_url: "",
    address: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    const initData = async () => {
      await loadLocations();
      await loadRestaurant();
    };
    initData();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const restaurantId = id ? Number(id) : undefined;
      if (!restaurantId || isNaN(restaurantId)) return;

      const data = await RestaurantService.getRestaurant(restaurantId);

      let menuString = "";
      if (data.menu && Array.isArray(data.menu)) {
        menuString = data.menu
          .map((item: any) => `${item.name} - ${Math.floor(item.price)}`) // Làm tròn giá món ăn
          .join("\n");
      }

      setForm({
        location_id: data.location_id || "",
        name: data.name || "",
        // Làm sạch số nguyên khi load từ DB lên
        min_price: data.min_price ? Math.floor(data.min_price).toString() : "",
        max_price: data.max_price ? Math.floor(data.max_price).toString() : "",
        discount_percent: data.discount_percent
          ? Math.floor(data.discount_percent).toString()
          : "0",
        promotion_end: data.promotion_end
          ? data.promotion_end.split("T")[0]
          : "",
        description: data.description || "",
        menu_content: menuString,
        amenities: Array.isArray(data.amenities)
          ? data.amenities.join(", ")
          : data.amenities || "",
        image_url: data.image_url || "",
        address: data.address || "",
        lat: data.lat || "",
        lng: data.lng || "",
      });
    } catch (error) {
      console.error("Lỗi khi tải thông tin nhà hàng:", error);
      alert("Không thể tải thông tin nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const data = await RestaurantService.getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách địa điểm:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    // Xử lý chặn số lẻ ngay khi gõ cho các trường giá và giảm giá
    if (["min_price", "max_price", "discount_percent"].includes(name)) {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
      return;
    }

    let val: any = value;
    if (type === "checkbox") val = checked;

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const restaurantId = id ? Number(id) : undefined;
      if (!restaurantId || isNaN(restaurantId))
        throw new Error("ID không hợp lệ");

      const menuArray = form.menu_content
        ? form.menu_content
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
              const [name, price] = line.split("-");
              return {
                name: name ? name.trim() : "Món chưa đặt tên",
                price: price
                  ? Math.round(Number(price.trim().replace(/[^0-9]/g, "")))
                  : 0,
              };
            })
        : [];

      const payload = {
        ...form,
        location_id: form.location_id ? Number(form.location_id) : null,
        min_price: form.min_price ? Number(form.min_price) : null,
        max_price: form.max_price ? Number(form.max_price) : null,
        discount_percent: Number(form.discount_percent),
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        menu: menuArray,
        amenities: form.amenities
          ? form.amenities.split(",").map((i) => i.trim())
          : [],
        is_promotion: Number(form.discount_percent) > 0 || !!form.promotion_end,
      };

      await RestaurantService.updateRestaurant(restaurantId, payload);
      alert("Cập nhật nhà hàng thành công!");
      navigate("/admin/restaurants");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà hàng:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96 text-gray-500">
        Đang tải dữ liệu nhà hàng...
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Nhà hàng</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        <div>
          <label className={labelClass}>Tên nhà hàng</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giá thấp nhất (VNĐ)</label>
            <input
              type="text"
              inputMode="numeric"
              name="min_price"
              value={form.min_price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Giá cao nhất (VNĐ)</label>
            <input
              type="text"
              inputMode="numeric"
              name="max_price"
              value={form.max_price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Giảm giá (%)</label>
            <input
              type="text"
              inputMode="numeric"
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

        {/* Các trường còn lại giữ nguyên logic nhưng áp dụng inputClass */}
        <div>
          <label className={labelClass}>Đường dẫn ảnh (URL)</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Địa chỉ chi tiết</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Vĩ độ (Latitude)</label>
            <input
              type="number"
              step="any"
              name="lat"
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
              value={form.lng}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Mô tả nhà hàng</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Nội dung thực đơn (Tên món - Giá tiền)
          </label>
          <textarea
            name="menu_content"
            placeholder="VD:&#10;Tôm hùm - 750000"
            value={form.menu_content}
            onChange={handleChange}
            rows={5}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Tiện ích (cách nhau bằng dấu phẩy)
          </label>
          <input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="Wifi, Máy lạnh..."
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Lưu thay đổi
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
