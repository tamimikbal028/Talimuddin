import React, { useState } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import {
  NotificationFilters,
  NotificationItem,
} from "../components/Notifications";

// TODO: Define types when API is connected
interface Notification {
  id: string;
  type: string;
  user: { name: string; avatar: string };
  content: string;
  timestamp: string;
  isRead: boolean;
  postContent?: string;
}

const Notifications: React.FC = () => {
  // TODO: Get filter from state management or URL params
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // TODO: Fetch notifications from API
  const notifications: Notification[] = [];

  const markAsRead = (id: string) => {
    // TODO: Call API to mark single notification as read
    console.log("TODO: Mark as read via API:", id);
  };

  const markAllAsRead = () => {
    // TODO: Call API to mark all as read
    console.log("TODO: Mark all as read via API");
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notif) => !notif.isRead)
      : notifications;

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex cursor-pointer items-center gap-2 font-medium text-blue-600"
          >
            <FaCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <NotificationFilters />

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <FaBell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "All caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              type={notification.type}
              user={notification.user}
              content={notification.content}
              timestamp={notification.timestamp}
              isRead={notification.isRead}
              postContent={notification.postContent}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredNotifications.length > 0 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-2 font-medium text-blue-600 hover:text-blue-700">
            Load more notifications
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
