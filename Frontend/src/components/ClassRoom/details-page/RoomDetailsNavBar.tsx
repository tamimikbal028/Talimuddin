import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  FaUsers,
  FaFolder,
  FaInfoCircle,
  FaUserPlus,
  FaShieldAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import { useDropdown } from "../../../hooks/useDropdown";
import type { RoomMeta } from "../../../types/room.types";

interface RoomDetailsNavBarProps {
  meta?: RoomMeta;
}

const RoomDetailsNavBar: React.FC<RoomDetailsNavBarProps> = ({ meta }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const baseUrl = `/classroom/rooms/${roomId}`;
  const {
    isOpen: showMoreMenu,
    openUpward: openUpwards,
    menuRef: moreMenuRef,
    triggerRef: moreButtonRef,
    toggle: toggleMoreMenu,
    close: closeMoreMenu,
  } = useDropdown(200);

  // Primary tabs (always visible)
  const primaryTabs = [
    { path: baseUrl, label: "Posts", icon: BsPostcard, end: true },
    { path: `${baseUrl}/files`, label: "Files", icon: FaFolder, end: true },
    ...(meta?.isCreator || meta?.isAdmin
      ? [
          {
            path: `${baseUrl}/requests`,
            label: "Requests",
            icon: FaUserPlus,
            end: true,
            count: meta?.pendingRequestsCount,
          },
        ]
      : []),
    {
      path: `${baseUrl}/moderation`,
      label: "Pending",
      icon: FaShieldAlt,
      end: true,
      count: meta?.pendingPostsCount,
    },
  ];

  // Secondary tabs (in "More" dropdown)
  const secondaryTabs = [
    { path: `${baseUrl}/members`, label: "Members", icon: FaUsers, end: true },
    { path: `${baseUrl}/about`, label: "About", icon: FaInfoCircle, end: true },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 sm:gap-4 md:gap-8">
        {/* Primary Tabs */}
        {primaryTabs.map((tab) => (
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
            <div className="relative">
              <tab.icon className="h-5 w-5" />
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {tab.count > 99 ? "99+" : tab.count}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">{tab.label}</span>
          </NavLink>
        ))}

        {/* More Dropdown */}
        <div className="relative" ref={moreMenuRef}>
          <button
            ref={moreButtonRef}
            onClick={toggleMoreMenu}
            className="flex items-center gap-2 border-b-2 border-transparent px-4 py-4 font-semibold text-gray-600 transition-colors hover:text-gray-900"
          >
            <FaEllipsisH className="h-5 w-5" />
            <span className="hidden sm:inline">More</span>
          </button>

          {showMoreMenu && (
            <div
              className={`absolute left-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg sm:right-0 sm:left-auto ${
                openUpwards ? "bottom-full mb-2" : "top-full mt-1"
              } animate-in fade-in zoom-in duration-200`}
            >
              <div className="py-1">
                {secondaryTabs.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    end={tab.end}
                    onClick={closeMoreMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsNavBar;
