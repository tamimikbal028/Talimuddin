import React, { useState } from "react";

// TODO: Replace with props or API data
interface NotificationFiltersProps {
  notifications?: { isRead: boolean }[];
  onFilterChange?: (filter: "all" | "unread") => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  notifications = [],
  onFilterChange,
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const handleFilterChange = (newFilter: "all" | "unread") => {
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  return (
    <div className="mb-6 flex border-b border-gray-200">
      <button
        onClick={() => handleFilterChange("all")}
        className={`px-4 py-2 text-sm font-medium ${
          filter === "all"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleFilterChange("unread")}
        className={`px-4 py-2 text-sm font-medium ${
          filter === "unread"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Unread {unreadCount > 0 && `(${unreadCount})`}
      </button>
    </div>
  );
};

export default NotificationFilters;
