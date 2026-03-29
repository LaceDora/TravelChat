export interface AdminMenuItem {
  key: string;
  label: string;
  path: string;
  icon?: string;
}

export const adminMenu: AdminMenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    key: "users",
    label: "Người dùng",
    path: "/admin/users",
    icon: "👤",
  },
  {
    key: "categories",
    label: "Danh mục",
    path: "/admin/categories",
    icon: "📂",
  },
  {
    key: "explores",
    label: "Khám phá",
    path: "/admin/explores",
    icon: "🧭",
  },
  {
    key: "locations",
    label: "Địa điểm",
    path: "/admin/locations",
    icon: "📍",
  },
  {
    key: "hotels",
    label: "Khách sạn",
    path: "/admin/hotels",
    icon: "🏨",
  },
  {
    key: "restaurants",
    label: "Nhà hàng",
    path: "/admin/restaurants",
    icon: "🍽️",
  },
  {
    key: "tours",
    label: "Tour",
    path: "/admin/tours",
    icon: "🧳",
  },
  {
    key: "blogs",
    label: "Bài viết",
    path: "/admin/blogs",
    icon: "📝",
  },
  {
    key: "bookings",
    label: "Đặt chỗ",
    path: "/admin/bookings",
    icon: "📑",
  },
];
