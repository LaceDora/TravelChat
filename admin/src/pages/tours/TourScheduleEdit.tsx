import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourService from "../../services/TourService";

export default function TourScheduleEdit() {
  const { id, scheduleId } = useParams(); // id = tourId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    day_number: "",
    time: "", // Thêm trường time
    title: "",
    activity: "",
  });

  const [tourName, setTourName] = useState("");

  useEffect(() => {
    if (scheduleId) {
      fetchSchedule();
    }
    if (id) {
      fetchTourName();
    }
  }, [scheduleId, id]);

  async function fetchTourName() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name || "");
    } catch (error) {
      setTourName("");
    }
  }

  async function fetchSchedule() {
    try {
      const data = await TourService.getSchedule(Number(scheduleId));

      setFormData({
        day_number: data.day_number || "",
        time: data.time || "", // Load dữ liệu time từ API
        title: data.title || "",
        activity: data.activity || "",
      });
    } catch (error) {
      console.error("Lỗi tải lịch trình:", error);
      alert("Không thể tải thông tin lịch trình.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduleId) return;

    setSaving(true);

    try {
      await TourService.updateSchedule(Number(scheduleId), {
        tour_id: Number(id),
        day_number: Number(formData.day_number),
        time: formData.time, // Gửi dữ liệu time cập nhật
        title: formData.title,
        activity: formData.activity,
      });

      alert("Cập nhật lịch trình thành công!");
      navigate(`/admin/tours/${id}/schedules`);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 max-w-5xl mx-auto">
        Đang tải thông tin lịch trình...
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col mb-4 items-start">
        <h1 className="text-2xl font-bold text-gray-800">
          Chỉnh sửa Lịch trình
        </h1>
        <p className="text-blue-600 font-medium">Tour: {tourName}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Số ngày */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Ngày số
            </label>
            <input
              type="number"
              name="day_number"
              value={formData.day_number}
              onChange={handleChange}
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Thời gian */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Thời gian
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="VD: 08:30"
            />
          </div>
        </div>

        {/* Tiêu đề */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Tiêu đề / Địa điểm
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Hoạt động */}
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700">
            Chi tiết hoạt động
          </label>
          <textarea
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            rows={5}
            required
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Nút thao tác */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300"
          >
            {saving ? "Đang lưu..." : "Cập nhật Lịch trình"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admin/tours/${id}/schedules`)}
            className="flex-1 bg-gray-100 text-gray-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
