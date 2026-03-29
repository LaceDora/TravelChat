const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  headers?: HeadersInit;
}

async function fetchClient<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    credentials: "include", // dùng cho auth.session
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  // Một số API delete có thể không trả body
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export default fetchClient;
