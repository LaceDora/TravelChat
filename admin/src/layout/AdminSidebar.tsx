import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Hotel,
  Utensils,
  Map,
  FileText,
  CalendarCheck,
  Star,
  BarChart3,
  LogOut,
  Palette,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Người dùng", path: "/admin/users" },
  { icon: MapPin, label: "Địa điểm", path: "/admin/locations" },
  { icon: Hotel, label: "Khách sạn", path: "/admin/hotels" },
  { icon: Utensils, label: "Nhà hàng", path: "/admin/restaurants" },
  { icon: Map, label: "Tours", path: "/admin/tours" },
  { icon: FileText, label: "Bài viết", path: "/admin/blogs" },
  { icon: CalendarCheck, label: "Đặt chỗ", path: "/admin/bookings" },
  { icon: Star, label: "Đánh giá", path: "/admin/reviews" },
  // { icon: Palette, label: "Theme chủ đề", path: "/admin/themes" },
  { icon: BarChart3, label: "Báo cáo", path: "/admin/reports" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          T
        </div>
        <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Travel Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
          >
            <item.icon
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
