import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { authHooks } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { isAuthenticated } = authHooks.useUser();

  if (!isAuthenticated) {
    return null; // Don't show navbar if not authenticated
  }

  const navItems = [{ to: "/", icon: FaHome, label: "Home" }];

  return (
    <nav className="sticky top-0 z-50 flex h-12 w-full items-center justify-evenly border-b border-gray-200 bg-white shadow-sm">
      {/* 4 buttons with map */}
      {navItems.map(({ to, icon: Icon, label }) => (
        <div key={to} className="group relative">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg p-2 transition-colors ${isActive ? "text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="hidden text-sm font-medium md:block">{label}</span>
          </NavLink>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
