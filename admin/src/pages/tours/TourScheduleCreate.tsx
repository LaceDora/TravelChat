import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

export default function TourScheduleCreate() {
  const { id } = useParams(); // tour id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    day_number: "",
    time: "",
    title: "",
    activity: "",
  });

  const [loading, setLoading] = useState(false);
  const [tourName, setTourName] = useState("");

  // Khai báo các class đồng bộ để code sạch hơn
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";
  const inputClass =
    "w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  useEffect(() => {
    if (id) fetchTourName();
  }, [id]);

  async function fetchTourName() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name || "");
    } catch (error) {
      setTourName("");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      await TourService.createSchedule({
        tour_id: Number(id),
        day_number: Number(formData.day_number),
        time: formData.time,
        title: formData.title,
        activity: formData.activity,
      });
      alert("Thêm lịch trình thành công!");
      navigate(`/admin/tours/${id}/schedules`);
    } catch (error) {
      alert("Không thể tạo lịch trình. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thêm Lịch trình Mới
          </h1>
          <p className="text-blue-600 font-medium italic text-sm">
            Tour: {tourName}
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/tours/${id}/schedules`)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Số ngày */}
          <div>
            <label className={labelClass}>Ngày thứ mấy?</label>
            <input
              type="number"
              name="day_number"
              value={formData.day_number}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="VD: 1"
            />
          </div>

          {/* Thời gian - Có gợi ý để nhập Sáng/Chiều/Tối hoặc Giờ */}
          <div>
            <label className={labelClass}>Thời gian (Giờ hoặc Buổi)</label>
            <input
              type="text"
              name="time"
              list="time-suggestions"
              value={formData.time}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nhập giờ (08:00) hoặc chữ (Sáng)..."
            />
            {/* Datalist giúp bạn chọn nhanh nhưng vẫn nhập tự do được */}
            <datalist id="time-suggestions">
              <option value="Sáng" />
              <option value="Trưa" />
              <option value="Chiều" />
              <option value="Tối" />
              <option value="Cả ngày" />
            </datalist>
          </div>
        </div>

        {/* Tiêu đề */}
        <div>
          <label className={labelClass}>Tiêu đề hoạt động / Địa điểm</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="VD: Ăn sáng tại khách sạn / Tham quan Phố Cổ"
          />
        </div>

        {/* Hoạt động */}
        <div>
          <label className={labelClass}>Chi tiết hoạt động</label>
          <textarea
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            rows={6}
            className={inputClass}
            placeholder="Mô tả chi tiết các hoạt động diễn ra..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm disabled:bg-blue-300"
          >
            {loading ? "Đang lưu..." : "Lưu Lịch trình"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/tours/${id}/schedules`)}
            className="flex-1 bg-gray-100 text-gray-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
