import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TourService from "../../services/TourService";

interface Schedule {
  id: number;
  tour_id: number;
  day_number: number;
  time: string;
  title: string;
  activity: string;
}

export default function TourScheduleList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tourName, setTourName] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSchedules();
      fetchTour();
    }
  }, [id]);

  async function fetchTour() {
    try {
      const tour = await TourService.getTour(Number(id));
      setTourName(tour.name);
    } catch (error) {
      console.error("Lỗi tải thông tin tour:", error);
    }
  }

  async function fetchSchedules() {
    try {
      const data = await TourService.getSchedulesByTour(Number(id));
      const sortedData = data.sort((a: Schedule, b: Schedule) => {
        if (a.day_number !== b.day_number) return a.day_number - b.day_number;
        return (a.time || "").localeCompare(b.time || "");
      });
      setSchedules(sortedData);
    } catch (error) {
      console.error("Lỗi tải lịch trình:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(scheduleId: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch trình này không?")) return;
    try {
      await TourService.deleteSchedule(scheduleId);
      setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      alert("Có lỗi xảy ra khi xóa lịch trình.");
    }
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 max-w-5xl mx-auto">
        Đang tải lịch trình...
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết Lịch trình
          </h1>
          <p className="text-sm text-blue-600 font-medium mt-1">{tourName}</p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/admin/tours/${id}/schedules/create`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 text-sm"
          >
            + Thêm Hoạt Động
          </Link>
          <button
            type="button"
            onClick={() => navigate("/admin/tours")}
            className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Quay lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                <th className="px-5 py-3.5 text-left w-24">Ngày</th>
                <th className="px-5 py-3.5 text-left w-32">Thời gian</th>
                <th className="px-5 py-3.5 text-left">Tiêu đề / Địa điểm</th>
                <th className="px-5 py-3.5 text-left">Hoạt động chi tiết</th>
                <th className="px-5 py-3.5 text-center w-36">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {schedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-sm font-bold text-gray-700">
                    Ngày {schedule.day_number}
                  </td>
                  <td className="px-5 py-4 text-sm text-blue-600 font-medium">
                    {schedule.time || "--:--"}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    {schedule.title}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-md">
                    <div className="line-clamp-2" title={schedule.activity}>
                      {schedule.activity}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <div className="flex justify-center gap-3">
                      {/* Nút Sửa với Icon SVG chuẩn */}
                      <Link
                        to={`/admin/tours/${id}/schedules/edit/${schedule.id}`}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>

                      {/* Nút Xóa với Icon SVG chuẩn */}
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-400 text-sm italic"
                  >
                    Chưa có lịch trình nào cho tour này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
