import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaUsers, FaFolder, FaInfoCircle } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";

const RoomDetailsNavBar: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const baseUrl = `/classroom/rooms/${roomId}`;
  // Navigation tabs
  const tabs = [
    { path: baseUrl, label: "Posts", icon: BsPostcard, end: true },
    { path: `${baseUrl}/files`, label: "Files", icon: FaFolder, end: true },
    { path: `${baseUrl}/members`, label: "Members", icon: FaUsers, end: true },
    { path: `${baseUrl}/about`, label: "About", icon: FaInfoCircle, end: true },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="no-scrollbar flex items-center justify-between overflow-x-auto px-6 sm:gap-4 md:gap-8">
        {/* Nav Tabs */}
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-shrink-0 items-center gap-2 border-b-2 px-4 py-4 font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <div className="relative">
              <tab.icon className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default RoomDetailsNavBar;
