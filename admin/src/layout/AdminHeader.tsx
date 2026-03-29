const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h3>Admin Dashboard</h3>
      </div>

      <div className="admin-header-right">
        <span className="admin-user-name">Admin</span>
        <button className="admin-logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
