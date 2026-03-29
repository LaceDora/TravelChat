const API_BASE = "http://127.0.0.1:8000/api";

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json();
}

// const API_BASE = import.meta.env.VITE_API_BASE;

// export async function apiGet<T>(endpoint: string): Promise<T> {
//   const res = await fetch(`${API_BASE}${endpoint}`, {
//     credentials: "include", // nếu dùng session Laravel
//   });

//   if (!res.ok) {
//     throw new Error("API error");
//   }

//   return res.json();
// }

// export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
//   const res = await fetch(`${API_BASE}${endpoint}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("API error");
//   return res.json();
// } cái này để đưa lên host
