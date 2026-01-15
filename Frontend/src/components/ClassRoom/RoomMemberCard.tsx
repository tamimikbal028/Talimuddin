import React from "react";
import { NavLink } from "react-router-dom";

interface RoomMemberItem {
  user: {
    _id: string;
    fullName: string;
    userName: string;
    avatar: string;
  };
  meta: {
    memberId: string;
    role: string;
    isSelf: boolean;
    isCR: boolean;
    isAdmin: boolean;
    isCreator: boolean;
  };
}

interface RoomMemberCardProps {
  member: RoomMemberItem;
  currentUserRole: string | null;
}

const RoomMemberCard: React.FC<RoomMemberCardProps> = ({ member }) => {
  const { user, meta } = member;

  // Role badge
  const getRoleBadge = () => {
    if (meta.isCreator) {
      return (
        <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
          Creator
        </span>
      );
    }
    if (meta.isAdmin) {
      return (
        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
          Admin
        </span>
      );
    }
    if (meta.isCR) {
      return (
        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
          CR
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`flex items-center space-x-3 rounded-lg border p-2 shadow-sm ${
        meta.isSelf
          ? "border-green-200 bg-green-50"
          : "border-gray-300 bg-white"
      }`}
    >
      <NavLink to={`/profile/${user.userName}`}>
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3 className="flex items-center">
          <NavLink
            to={`/profile/${user.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-green-600 hover:underline"
          >
            {user.fullName}
          </NavLink>
          {getRoleBadge()}
        </h3>
        <p className="text-sm font-medium text-gray-500">@{user.userName}</p>
      </div>
    </div>
  );
};

export default RoomMemberCard;
