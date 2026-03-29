import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              Travel SE Asia
            </span>
          </Link>

          {/* Menu */}
          <Navbar />

          {/* Account */}
          {user ? (
            <Link
              to={`/profile/${user.id}`}
              className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600"
              title={user.name}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
            >
              👤
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
