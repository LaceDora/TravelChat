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
    transport: "",
    departure_location: "",
    description: "",
    content: "",
    combo_content: "",
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

      // Map dữ liệu từ API vào state
      setFormData({
        location_id: data.location_id?.toString() || "",
        name: data.name || "",
        days: data.days?.toString() || "",
        transport: data.transport || "",
        departure_location: data.departure_location || "",
        description: data.description || "",
        content: data.content || "",
        combo_content: data.combo_content || "",
        image_url: data.image_url || "",
      });
    } catch (error) {
      console.error("Load tour failed:", error);
      alert("Không thể tải thông tin tour");
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

    const payload = {
      ...formData,
      location_id: formData.location_id ? Number(formData.location_id) : null,
      days: formData.days ? Number(formData.days) : null,
      transport: formData.transport || null,
      departure_location: formData.departure_location || null,
      description: formData.description || null,
      content: formData.content || null,
      combo_content: formData.combo_content || null,
      image_url: formData.image_url || null,
    };

    try {
      await TourService.updateTour(Number(id), payload);
      alert("Cập nhật tour thành công!");
      navigate("/admin/tours");
    } catch (error) {
      console.error("Update tour failed:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải dữ liệu tour...
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Tour</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tên Tour */}
          <div className="md:col-span-2">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Tên Tour
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Khu vực */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Khu vực
            </label>
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Chọn khu vực</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Số ngày */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Số ngày
            </label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vận chuyển */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Phương tiện
            </label>
            <input
              type="text"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Điểm khởi hành */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Điểm khởi hành
            </label>
            <input
              type="text"
              name="departure_location"
              value={formData.departure_location}
              onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Link ảnh */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Link hình ảnh
          </label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Nội dung Combo */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Nội dung Combo
          </label>
          <textarea
            name="combo_content"
            value={formData.combo_content}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Mô tả ngắn
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Nội dung chi tiết */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Nội dung chi tiết
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            {saving ? "Đang lưu..." : "Cập nhật Tour"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/tours")}
            className="bg-gray-100 text-gray-600 px-8 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
