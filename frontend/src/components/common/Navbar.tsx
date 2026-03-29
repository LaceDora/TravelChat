import { NavLink } from "react-router-dom";

const menus = [
  { label: "Home", path: "/" },
  { label: "Địa điểm", path: "/locations" },
  { label: "Tour", path: "/tours" },
  { label: "Dịch vụ", path: "/services" },
];

export default function Navbar() {
  return (
    <nav className="hidden md:flex gap-8">
      {menus.map((m) => (
        <NavLink
          key={m.path}
          to={m.path}
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            }`
          }
        >
          {m.label}
        </NavLink>
      ))}
    </nav>
  );
}
