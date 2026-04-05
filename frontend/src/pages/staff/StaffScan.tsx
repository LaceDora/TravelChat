import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { apiPost } from "../../service/api";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Camera,
  RefreshCw,
  User,
  Calendar,
  MapPin,
  Hash,
} from "lucide-react";

export default function StaffScan() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualId, setManualId] = useState("");
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false,
    );

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner
        .clear()
        .catch((error) =>
          console.error("Failed to clear html5QrcodeScanner. ", error),
        );
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (isVerifying) return;

    try {
      // Dữ liệu trong QR là JSON: { booking_id, target, type }
      const data = JSON.parse(decodedText);
      if (data.booking_id) {
        handleVerify(data.booking_id);
      } else {
        toast.error("Mã QR không hợp lệ (Thiếu ID)");
      }
    } catch (e) {
      // Nếu không phải JSON, thử quét xem đó có phải là số ID không
      if (!isNaN(Number(decodedText))) {
        handleVerify(Number(decodedText));
      } else {
        toast.error("Định dạng mã QR không hỗ trợ");
      }
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const handleVerify = async (bookingId: number) => {
    setIsVerifying(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await apiPost<any>("/bookings/verify-qr", {
        booking_id: bookingId,
      });
      if (response.success) {
        setScanResult(response.data);
        toast.success(response.message);
      } else {
        setError(response.message || "Xác minh thất bại");
        toast.error(response.message || "Xác minh thất bại");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi kết nối server";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = () => {
    const id = Number(manualId.replace("#", "").trim());
    if (!id || isNaN(id)) {
      toast.error("Vui lòng nhập mã booking hợp lệ (VD: 40)");
      return;
    }
    handleVerify(id);
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setManualId("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Quét Mã Booking</h1>
          <p className="text-slate-500">
            Dành cho nhân viên xác minh vé khách hàng
          </p>
        </div>

        {/* Scanner Area */}
        {!scanResult && !error && (
          <>
            <div className="bg-white p-4 rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div id="reader" className="overflow-hidden rounded-2xl"></div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-spin-slow" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Đang bật camera... Vui lòng đưa mã QR của khách hàng vào khung
                  hình để tự động nhận dạng.
                </p>
              </div>
            </div>

            {/* Manual ID Input - Fallback */}
            <div className="mt-6 bg-white p-5 rounded-3xl shadow-md border border-slate-100">
              <button
                onClick={() => setShowManual(!showManual)}
                className="w-full flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <span className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Nhập mã Booking thủ công
                </span>
                <span className="text-slate-400">{showManual ? "▲" : "▼"}</span>
              </button>

              {showManual && (
                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="VD: 40"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-lg font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                  />
                  <button
                    onClick={handleManualVerify}
                    disabled={isVerifying}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                  >
                    {isVerifying ? "..." : "Xác minh"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Success Result */}
        {scanResult && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-green-500 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
              Hợp Lệ!
            </h2>
            <p className="text-center text-green-600 font-medium mb-8">
              Check-in thành công
            </p>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Khách hàng
                  </p>
                  <p className="font-bold text-slate-800">
                    {scanResult.customer_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Dịch vụ
                  </p>
                  <p className="font-bold text-slate-800">
                    {scanResult.service_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Thời gian quét
                  </p>
                  <p className="font-bold text-slate-800">
                    {scanResult.checked_in_at}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={resetScanner}
              className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Tiếp tục quét
            </button>
          </div>
        )}

        {/* Error Result */}
        {error && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-red-500 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
              Thất Bại
            </h2>
            <p className="text-center text-red-600 font-medium mb-6 leading-relaxed">
              {error}
            </p>

            <button
              onClick={resetScanner}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Thử quét lại
            </button>
          </div>
        )}

        <p className="text-center mt-8 text-slate-400 text-sm">
          Phiên bản dành cho Staff nội bộ v1.1
        </p>
      </div>

      <style>{`
        #reader__scan_region {
          background: #f8fafc;
        }
        #reader__dashboard_section_csr button {
          padding: 8px 16px;
          background: #2563eb;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 10px;
        }
        #reader__camera_selection {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin: 10px 0;
          width: 100%;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
