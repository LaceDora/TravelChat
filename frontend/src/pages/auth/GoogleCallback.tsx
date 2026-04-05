import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const data = searchParams.get("data");
    const error = searchParams.get("error");

    if (error) {
      // Có lỗi - redirect về login với error message
      alert(error);
      navigate("/login");
      return;
    }

    if (data) {
      try {
        // Decode user data từ backend
        const decoded = JSON.parse(atob(data));

        if (decoded.status && decoded.user) {
          // Lưu user vào localStorage
          localStorage.setItem("user", JSON.stringify(decoded.user));

          // Đóng popup nếu đang ở popup
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "GOOGLE_LOGIN_SUCCESS",
                user: decoded.user,
              },
              "*",
            );
            window.close();
          } else {
            // Nếu không phải popup, redirect về profile
            navigate(`/profile/${decoded.user.id}`);
          }
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Google callback error:", err);
        alert("Đăng nhập thất bại");
        navigate("/login");
      }
    } else {
      // Không có data - redirect về login
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
