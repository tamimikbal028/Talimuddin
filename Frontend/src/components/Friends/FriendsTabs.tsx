import React from "react";
import { NavLink } from "react-router-dom";

const FriendsTabs: React.FC = () => {
  const tabs = [
    { path: "/friends", label: "All Friends", end: true },
    { path: "/friends/requests", label: "Friend Requests", end: false },
    { path: "/friends/suggestions", label: "Suggestions", end: false },
    { path: "/friends/sent", label: "Sent Requests", end: false },
  ] as const;

  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          replace
          end={tab.end}
          className={({ isActive }) =>
            `flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default FriendsTabs;
