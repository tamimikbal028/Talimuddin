import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GamingHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const tabs = [
    { path: "/gaming/dashboard", label: "Dashboard" },
    { path: "/gaming/tournament", label: "Tournament" },
    { path: "/gaming/play", label: "Play" },
    { path: "/gaming/leaderboard", label: "Leaderboard" },
    { path: "/gaming/achievements", label: "Achievements" },
  ];

  return (
    <div className="flex items-center justify-between space-x-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gaming Hub</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-3">
        {tabs.map((tab) => {
          const active =
            isActive(tab.path) ||
            (tab.path === "/gaming/dashboard" &&
              isActive("/gaming") &&
              location.pathname === "/gaming");
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`cursor-pointer rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GamingHeader;
