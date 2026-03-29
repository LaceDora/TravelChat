import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // VNPay trả params trực tiếp trên URL
    const params = new URLSearchParams(window.location.search);
    const responseCode = params.get("vnp_ResponseCode");

    if (responseCode === "00") {
      setStatus("success");
      setMessage("Thanh toán thành công!");

      setTimeout(() => {
        navigate("/bookings");
      }, 3000);
    } else {
      setStatus("error");
      setMessage("Thanh toán thất bại hoặc bị huỷ");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {status === "loading" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">
              Đang xử lý kết quả thanh toán...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Thanh Toán Thành Công!
            </h1>
            <p className="text-xl text-gray-700 mb-6">{message}</p>
            <p className="text-gray-600">
              Đang chuyển hướng tới lịch sử đặt chỗ...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Thanh Toán Thất Bại
            </h1>
            <p className="text-xl text-gray-700 mb-6">{message}</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/payment")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
              >
                Thử Lại
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Quay Lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
