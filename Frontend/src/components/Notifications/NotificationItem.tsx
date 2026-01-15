import React from "react";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaUserPlus,
  FaBell,
} from "react-icons/fa";

interface NotificationUser {
  name: string;
  username: string;
  avatar: string;
}

interface NotificationItemProps {
  id: string;
  type: "like" | "comment" | "share" | "follow" | "mention";
  user: NotificationUser;
  content: string;
  timestamp: string;
  isRead: boolean;
  postContent?: string;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  user,
  content,
  timestamp,
  isRead,
  postContent,
  onMarkAsRead,
}) => {
  const getNotificationIcon = (type: NotificationItemProps["type"]) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-red-500" />;
      case "comment":
        return <FaComment className="text-blue-500" />;
      case "share":
        return <FaShare className="text-green-500" />;
      case "follow":
        return <FaUserPlus className="text-purple-500" />;
      case "mention":
        return <FaBell className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
        !isRead
          ? "border-blue-500 bg-blue-100 hover:bg-blue-100"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-semibold text-gray-900">{user.name}</span>
            <span className="text-sm text-gray-500">@{user.username}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{timestamp}</span>
            {!isRead && (
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            )}
          </div>
          <div className="mb-2 flex items-center gap-2">
            {getNotificationIcon(type)}
            <span className="text-gray-700">{content}</span>
          </div>
          {postContent && (
            <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
              "{postContent}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
