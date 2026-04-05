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

  // Loại bỏ '/api' dư thừa ở đầu endpoint nếu có
  let cleanEndpoint = endpoint;
  if (cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api\//, "/");
  }

  const config: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
    // Required for Laravel Sanctum/Session
    credentials: "include",
  };

  if (body) {
    if (isFormData) {
      config.body = body;
    } else {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
      config.body = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(`${API_BASE}${cleanEndpoint}`, config);

    // Xử lý response no-content
    if (res.status === 204) {
      return {} as T;
    }

    const data = await res.json();

    if (!res.ok) {
      // Trường hợp Laravel trả về mảng errors
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

// Helpers
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
