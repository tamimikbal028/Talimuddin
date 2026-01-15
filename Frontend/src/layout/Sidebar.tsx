import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaBell,
  FaSchool,
  FaSignOutAlt,
  FaBookmark,
  FaHome,
  FaTint,
} from "react-icons/fa";
import { prefetchRoute } from "../routes/prefetch";
import { authHooks } from "../hooks/useAuth";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { mutate: logout, isPending: isLoggingOut } = authHooks.useLogout();
  const { user } = authHooks.useUser();

  // Dynamic profile path - uses username
  const profilePath = user?.userName ? `/profile/${user.userName}` : "/profile";

  const navigationItems = [
    {
      icon: FaHome,
      label: "Home",
      path: "/",
      active: location.pathname === "/",
    },
    {
      icon: FaSchool,
      label: "All Rooms",
      path: "/classroom",
      active: location.pathname === "/classroom",
    },
    {
      icon: FaSchool,
      label: "My Rooms",
      path: "/classroom/my",
      active: location.pathname === "/classroom/my",
    },
    {
      icon: FaBell,
      label: "Notifications",
      path: "/notifications",
      active: location.pathname.startsWith("/notifications"),
      badge: 5,
    },
    {
      icon: FaBookmark,
      label: "Saved",
      path: "/saved",
      active: location.pathname.startsWith("/saved"),
    },
    {
      icon: FaTint,
      label: "Blood Donation",
      path: "/blood-donation",
      active: location.pathname.startsWith("/blood-donation"),
    },
    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      active: location.pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="flex h-full flex-col space-y-1 p-3">
      {/* Logo/Brand - Click to go Home */}
      <NavLink
        to="/"
        className="flex items-center gap-3 border-b border-gray-300 px-2 pb-3"
      >
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-teal-500 shadow-md">
          <span className="text-2xl font-bold text-white">T</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">
            Talimuddin
          </span>
          <span className="text-sm font-medium text-gray-500">
            Islamic Academy
          </span>
        </div>
      </NavLink>

      {/* Navigation Menu */}
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                onMouseEnter={() => prefetchRoute(item.path)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-green-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      item.active
                        ? "text-green-600"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </div>
          ))}
        </nav>
      </div>

      {/* Profile & Logout Section */}
      <div className="border-t border-gray-300 pt-3">
        <div className="flex items-center gap-2">
          <NavLink
            to={profilePath}
            onMouseEnter={() => prefetchRoute(profilePath)}
            className={({ isActive }) =>
              `group flex flex-1 items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-green-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FaUser className="mr-3 h-5 w-5" />
            <span>Profile</span>
          </NavLink>

          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
            title="Logout"
          >
            <FaSignOutAlt className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
