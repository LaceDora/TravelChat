import { Outlet } from "react-router-dom";

function ProfileLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export default ProfileLayout;
