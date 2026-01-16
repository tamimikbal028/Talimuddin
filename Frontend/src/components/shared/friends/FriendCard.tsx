import React from "react";
import { NavLink } from "react-router-dom";
import FriendshipActionButtons from "./FriendshipActionButtons";
import { BsThreeDots } from "react-icons/bs";
import { USER_RELATION_STATUS } from "../../../constants";
import type { FriendUser } from "../../../types";

interface FriendCardProps {
  friend: FriendUser;
  meta: {
    user_relation_status: (typeof USER_RELATION_STATUS)[keyof typeof USER_RELATION_STATUS];
  };
  canShowMenu?: boolean;
  handleMemberMenu?: (userId: string, userName?: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  meta,
  canShowMenu,
  handleMemberMenu,
}) => {
  const institutionName = friend.institution?.name || "No Institution";

  return (
    <div
      className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-2 shadow-sm"
      data-status={meta.user_relation_status}
    >
      <NavLink to={`/profile/${friend.userName}`}>
        <img
          src={friend.avatar}
          alt={friend.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3>
          <NavLink
            to={`/profile/${friend.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {friend.fullName}
          </NavLink>
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      <div className="flex items-center gap-2">
        <FriendshipActionButtons
          userId={friend._id}
          user_relation_status={meta.user_relation_status}
        />

        {canShowMenu && (
          <button
            onClick={() => handleMemberMenu?.(friend._id, friend.fullName)}
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

export default FriendCard;
