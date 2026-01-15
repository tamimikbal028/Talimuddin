import React from "react";
import { NavLink } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import type { User } from "../../../types";

interface UserCardProps {
  user: User;
  canShowMenu?: boolean;
  handleMemberMenu?: (userId: string, userName?: string) => void;
  showInstitution?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  canShowMenu,
  handleMemberMenu,
}) => {
  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
      <NavLink to={`/profile/${user.userName}`}>
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3>
          <NavLink
            to={`/profile/${user.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-green-600 hover:underline"
          >
            {user.fullName}
          </NavLink>
        </h3>
        <p className="text-sm font-medium text-gray-500">@{user.userName}</p>
      </div>
      <div className="flex items-center gap-2">
        {canShowMenu && (
          <button
            onClick={() => handleMemberMenu?.(user._id, user.fullName)}
            className="p-1 text-gray-500 hover:text-gray-800"
            aria-label="Member menu"
          >
            <BsThreeDots className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
