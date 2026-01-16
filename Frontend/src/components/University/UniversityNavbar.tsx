import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/university", end: true },
  { id: "events", label: "Events", path: "/university/events" },
  { id: "noticeboard", label: "Notice Board", path: "/university/noticeboard" },
  {
    id: "academictimeline",
    label: "Academic Timeline",
    path: "/university/academictimeline",
  },
  { id: "more", label: "More", path: "/university/more" },
];

const UniversityNavbar: React.FC = () => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex justify-between overflow-x-auto px-7">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `border-b-2 py-3 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default UniversityNavbar;
