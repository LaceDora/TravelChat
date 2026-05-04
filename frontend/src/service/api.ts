export const API_BASE = "http://127.0.0.1:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  // 1. Lấy Token từ LocalStorage
  // Lưu ý: Đảm bảo tên 'token' này trùng với tên bạn dùng khi localStorage.setItem lúc Login
  const token = localStorage.getItem("token");

  // Loại bỏ '/api' dư thừa ở đầu endpoint nếu có
  let cleanEndpoint = endpoint;
  if (cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api\//, "/");
  }

  const config: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      // 2. Tự động gắn Token vào Header Authorization
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    // Credentials 'include' quan trọng nếu bạn dùng Laravel Sanctum (Cookies)
    credentials: "include",
  };

  // 3. Xử lý Body của Request
  if (body) {
    if (isFormData) {
      config.body = body;
      // Khi gửi FormData, Fetch tự động thiết lập Content-Type với boundary, không nên ghi đè
    } else {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE}${cleanEndpoint}`, config);

    // Xử lý lỗi xác thực (Token hết hạn hoặc sai)
    if (response.status === 401) {
      console.error("Lỗi 401: Phiên đăng nhập đã hết hạn hoặc không có quyền.");
      // Tùy chọn: Xóa token cũ và chuyển hướng về trang login
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }

    // Xử lý response no-content (204)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Xử lý các thông báo lỗi từ Laravel (trường hợp validation hoặc lỗi logic)
      const errorMessage =
        data.message ||
        (data.errors && Object.values(data.errors).flat()[0]) ||
        "Đã có lỗi xảy ra từ máy chủ";
      throw new Error(errorMessage as string);
    }

    return data as T;
  } catch (error: any) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Các hàm Helpers để gọi API nhanh hơn
 */

export function apiGet<T>(endpoint: string, headers?: Record<string, string>) {
  return apiClient<T>(endpoint, { method: "GET", headers });
}

export function apiPost<T>(endpoint: string, body: any, isFormData = false) {
  return apiClient<T>(endpoint, { method: "POST", body, isFormData });
}

export function apiPut<T>(endpoint: string, body: any, isFormData = false) {
  return apiClient<T>(endpoint, { method: "PUT", body, isFormData });
}

export function apiDelete<T>(endpoint: string) {
  return apiClient<T>(endpoint, { method: "DELETE" });
}

export function apiPatch<T>(endpoint: string, body: any, isFormData = false) {
  return apiClient<T>(endpoint, { method: "PATCH", body, isFormData });
}
