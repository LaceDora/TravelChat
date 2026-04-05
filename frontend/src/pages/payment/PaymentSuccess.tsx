import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Đọc status và message từ URL params
    const statusParam = searchParams.get("status");
    const messageParam = searchParams.get("message");

    if (statusParam === "success") {
      setStatus("success");
      setMessage(messageParam || "Thanh toán thành công!");

      // Redirect về booking history sau 3 giây
      setTimeout(() => {
        if (window.location.hostname.includes("ngrok")) {
          window.location.href = "http://localhost:5173/bookings";
        } else {
          window.location.href = "/bookings";
        }
      }, 3000);
    } else {
      setStatus("error");
      setMessage(messageParam || "Thanh toán thất bại");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {status === "loading" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Đang xác nhận thanh toán...</p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Thanh Toán Thành Công!
            </h1>
            <p className="text-xl text-gray-700 mb-8">{message}</p>
            <p className="text-gray-600 mb-6">
              Đang chuyển hướng tới lịch sử đặt chỗ...
            </p>
            <button
              onClick={() => {
                // Force full page reload to refresh booking list
                if (window.location.hostname.includes("ngrok")) {
                  window.location.href = "http://localhost:5173/bookings";
                } else {
                  window.location.href = "/bookings";
                }
              }}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Xem Lịch Sử Đặt Chỗ
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Thanh Toán Thất Bại
            </h1>
            <p className="text-xl text-gray-700 mb-8">{message}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  if (window.location.hostname.includes("ngrok")) {
                    window.location.href = "http://localhost:5173/payment";
                  } else {
                    navigate("/payment");
                  }
                }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Thử Lại
              </button>
              <button
                onClick={() => {
                  if (window.location.hostname.includes("ngrok")) {
                    window.location.href = "http://localhost:5173/bookings";
                  } else {
                    navigate("/bookings");
                  }
                }}
                className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 transition"
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
