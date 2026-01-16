import React from "react";
import { NavLink } from "react-router-dom";
import { FaDoorOpen } from "react-icons/fa";

const ClassRoomNavBar: React.FC = () => {
  const tabs = [
    { path: "/classroom", label: "Rooms", icon: FaDoorOpen, end: true },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-4 py-4 font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <tab.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ClassRoomNavBar;
