import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h2>Admin Panel</h2>
      </div>

      <nav className="admin-sidebar-menu">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/locations">Locations</NavLink>
        <NavLink to="/admin/hotels">Hotels</NavLink>
        <NavLink to="/admin/restaurants">Restaurants</NavLink>
        <NavLink to="/admin/tours">Tours</NavLink>
        <NavLink to="/admin/blogs">Blogs</NavLink>
        <NavLink to="/admin/bookings">Bookings</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
