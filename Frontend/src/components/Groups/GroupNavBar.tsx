import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  FaUsers,
  FaFolder,
  FaThumbtack,
  FaHandshake,
  FaInfoCircle,
  FaShieldAlt,
  FaEllipsisH,
  FaUserPlus,
} from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import { groupHooks } from "../../hooks/useGroup";
import { useDropdown } from "../../hooks/useDropdown";
import type { GroupMeta } from "../../types";

const GroupNavBar: React.FC<{ meta?: GroupMeta }> = ({ meta }) => {
  const { slug } = useParams<{ slug: string }>();
  const baseUrl = `/groups/${slug}`;
  const {
    isOpen: showMoreMenu,
    openUpward,
    menuRef: moreMenuRef,
    triggerRef: moreButtonRef,
    toggle: toggleMoreMenu,
    close: closeMoreMenu,
  } = useDropdown(300);

  // Fetch unread counts
  const { data: unreadData } = groupHooks.useGroupUnreadCounts();
  const unreadPinnedCount = unreadData?.data?.meta?.unreadPinnedCount || 0;
  const unreadMarketplaceCount =
    unreadData?.data?.meta?.unreadMarketplaceCount || 0;
  const pendingRequestsCount =
    unreadData?.data?.meta?.pendingRequestsCount || 0;

  const pendingPostsCount = unreadData?.data?.meta?.pendingPostsCount || 0;

  // Primary tabs (always visible)
  const primaryTabs = [
    { path: baseUrl, label: "Posts", icon: BsPostcard, end: true, badge: 0 },
    {
      path: `${baseUrl}/pinned`,
      label: "Pinned",
      icon: FaThumbtack,
      end: true,
      badge: unreadPinnedCount,
      badgeColor: "bg-blue-500",
    },
    {
      path: `${baseUrl}/media`,
      label: "Files",
      icon: FaFolder,
      end: true,
      badge: 0,
    },
    {
      path: `${baseUrl}/marketplace`,
      label: "Buy & Sell",
      icon: FaHandshake,
      end: true,
      badge: unreadMarketplaceCount,
      badgeColor: "bg-orange-500",
    },
  ];

  // Secondary tabs (in "More" dropdown)
  const secondaryTabs = [
    ...(meta?.isAdmin || meta?.isOwner || meta?.isModerator
      ? [
          {
            path: `${baseUrl}/requests`,
            label: "Requests",
            icon: FaUserPlus,
            end: true,
            badge: pendingRequestsCount,
            badgeColor: "bg-red-500",
          },
          {
            path: `${baseUrl}/moderation`,
            label: "Pending Posts",
            icon: FaShieldAlt,
            end: true,
            badge: pendingPostsCount,
            badgeColor: "bg-amber-500",
          },
        ]
      : []),
    {
      path: `${baseUrl}/members`,
      label: "Members",
      icon: FaUsers,
      end: true,
      badge: 0,
    },
    {
      path: `${baseUrl}/about`,
      label: "About",
      icon: FaInfoCircle,
      end: true,
      badge: 0,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-1 px-3">
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
            <tab.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge > 0 && (
              <span
                className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white ${tab.badgeColor}`}
              >
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
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
              className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                openUpward ? "bottom-full mb-1" : "top-full mt-1"
              }`}
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
                    {tab.badge > 0 && (
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white ${tab.badgeColor}`}
                      >
                        {tab.badge > 99 ? "99+" : tab.badge}
                      </span>
                    )}
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

export default GroupNavBar;
