import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  FaRss,
  FaGraduationCap,
  FaInfoCircle,
  FaPlusCircle,
} from "react-icons/fa";

const InstitutionNavBar: React.FC = () => {
  const { instId } = useParams<{ instId: string }>();
  const baseUrl = `/institutions/${instId}`;

  const tabs = [
    { path: baseUrl, label: "Feed", icon: FaRss, end: true },
    {
      path: `${baseUrl}/departments`,
      label: "Departments",
      icon: FaGraduationCap,
    },
    { path: `${baseUrl}/about`, label: "About", icon: FaInfoCircle },
    { path: `${baseUrl}/more`, label: "More+", icon: FaPlusCircle },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="no-scrollbar flex items-center justify-evenly overflow-x-auto px-4 whitespace-nowrap">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default InstitutionNavBar;
