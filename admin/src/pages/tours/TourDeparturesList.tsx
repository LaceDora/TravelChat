import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TourService from "../../services/TourService";
import { Tag } from "lucide-react"; // Thêm icon Tag cho đẹp

interface Departure {
  id: number;
  tour_id: number;
  departure_date: string;
  capacity: number;
  booked: number;
  price: number; // Giá gốc
  discount_percent: number; // Thêm % giảm giá
  is_promotion: boolean; // Thêm trạng thái khuyến mãi
  status: string; // available / full / cancelled
}

export default function TourDepartureList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tourName, setTourName] = useState("");
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDepartures();
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

  async function fetchDepartures() {
    try {
      const data = await TourService.getDeparturesByTour(Number(id));
      const sortedData = data.sort(
        (a: Departure, b: Departure) =>
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime(),
      );
      setDepartures(sortedData);
    } catch (error) {
      console.error("Lỗi tải danh sách khởi hành:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(depId: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa ngày khởi hành này không?")) return;
    try {
      await TourService.deleteDeparture(depId);
      setDepartures((prev) => prev.filter((d) => d.id !== depId));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      alert("Có lỗi xảy ra khi xóa dữ liệu.");
    }
  }

  const renderStatus = (status: string) => {
    const s = status?.toString().toLowerCase().trim();
    switch (s) {
      case "available":
        return (
          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-600">
            Còn chỗ
          </span>
        );
      case "full":
        return (
          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-orange-100 text-orange-600">
            Hết chỗ
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-red-100 text-red-600">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 max-w-5xl mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Đang tải thông tin khởi hành...
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Ngày khởi hành
          </h1>
          <p className="text-sm text-blue-600 font-medium mt-1">{tourName}</p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/admin/tours/${id}/departures/create`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm no-underline"
          >
            + Thêm Ngày Khởi Hành
          </Link>
          <button
            onClick={() => navigate("/admin/tours")}
            className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 text-sm transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] uppercase tracking-wider font-semibold text-gray-400 border-b border-gray-50">
                <th className="px-4 py-3.5 text-center w-12">STT</th>
                <th className="px-5 py-3.5 text-left">Ngày khởi hành</th>
                <th className="px-5 py-3.5 text-right">Giá & Khuyến mãi</th>
                <th className="px-5 py-3.5 text-center">
                  Số chỗ (Đã đặt/Tổng)
                </th>
                <th className="px-5 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-center w-36">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {departures.map((d, idx) => {
                // Tính giá sau khi giảm
                const finalPrice =
                  d.price * (1 - (d.discount_percent || 0) / 100);

                return (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-center text-sm text-gray-500 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-700">
                      {new Date(d.departure_date).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Cột Giá & Khuyến mãi */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        {d.discount_percent > 0 ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                                -{d.discount_percent}%
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {Number(d.price).toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-red-600">
                              {finalPrice.toLocaleString("vi-VN")} đ
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-blue-600">
                            {Number(d.price).toLocaleString("vi-VN")} đ
                          </span>
                        )}
                        {d.is_promotion && (
                          <span className="text-[9px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                            <Tag size={10} /> Đang chạy ưu đãi
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`font-bold ${d.booked >= d.capacity ? "text-red-500" : "text-gray-800"}`}
                        >
                          {d.booked}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span>{d.capacity}</span>
                      </div>
                      <div className="w-20 h-1 bg-gray-100 rounded-full mt-1.5 mx-auto overflow-hidden">
                        <div
                          className={`h-full transition-all ${d.booked >= d.capacity ? "bg-red-500" : "bg-blue-500"}`}
                          style={{
                            width: `${Math.min((d.booked / d.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {renderStatus(d.status)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/tours/${id}/departures/edit/${d.id}`}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
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
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
