import React from "react";
import { NavLink } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaUserShield, FaUserMinus } from "react-icons/fa";
import { AcceptButton, RejectButton } from "../shared/friends/FriendActions";
import FriendshipActionButtons from "../shared/friends/FriendshipActionButtons";
import { roomHooks } from "../../hooks/useRoom";
import confirm from "../../utils/sweetAlert";
import { useDropdown } from "../../hooks/useDropdown";
import type { RoomMember } from "../../types";

interface RoomMemberCardProps {
  member: RoomMember;
  currentUserRole: string | null;

  isPendingRequest?: boolean;
}

const RoomMemberCard: React.FC<RoomMemberCardProps> = ({
  member,
  currentUserRole,
  isPendingRequest = false,
}) => {
  const { user, meta } = member;

  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  // Room management mutations
  const { mutate: acceptJoinRequest, isPending: isAcceptingJoin } =
    roomHooks.useAcceptJoinRequest();
  const { mutate: rejectJoinRequest, isPending: isRejectingJoin } =
    roomHooks.useRejectJoinRequest();
  const { mutate: removeMember } = roomHooks.useRemoveRoomMember();
  const { mutate: promoteMember } = roomHooks.usePromoteRoomMember();
  const { mutate: demoteMember } = roomHooks.useDemoteRoomMember();

  // Check if 3-dot menu should show
  const canManage = meta.canManage;

  const handleAcceptJoinRequest = () => {
    acceptJoinRequest({ userId: user._id });
  };

  const handleRejectJoinRequest = () => {
    rejectJoinRequest({ userId: user._id });
  };

  const handleRemove = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Remove Member?",
      text: `${user.fullName} will be removed from this room.`,
      confirmButtonText: "Yes, remove",
      icon: "warning",
    });
    if (ok) {
      removeMember({ userId: user._id });
    }
  };

  const handlePromote = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Make Admin?",
      text: `${user.fullName} will be promoted to admin.`,
      confirmButtonText: "Yes, promote",
      icon: "info",
    });
    if (ok) {
      promoteMember({ userId: user._id });
    }
  };

  const handleDemote = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Demote Admin?",
      text: `${user.fullName} will be demoted to member.`,
      confirmButtonText: "Yes, demote",
      icon: "warning",
    });
    if (ok) {
      demoteMember({ userId: user._id });
    }
  };

  const renderActions = () => {
    if (isPendingRequest) {
      if (currentUserRole === "CREATOR" || currentUserRole === "ADMIN") {
        return (
          <div className="flex space-x-2">
            <AcceptButton
              onClick={handleAcceptJoinRequest}
              disabled={isAcceptingJoin}
            />
            <RejectButton
              onClick={handleRejectJoinRequest}
              disabled={isRejectingJoin}
            />
          </div>
        );
      }
      return null;
    }

    return (
      <FriendshipActionButtons
        userId={user._id}
        user_relation_status={meta.user_relation_status}
      />
    );
  };

  const institutionName = user.institution?.name || "No Institution";

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
        meta.isSelf ? "border-blue-200 bg-blue-50" : "border-gray-300 bg-white"
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
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {user.fullName}
          </NavLink>
          {getRoleBadge()}
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}

        {/* 3-dot dropdown menu */}
        {canManage && (
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
              title="More actions"
            >
              <BsThreeDots className="h-5 w-5" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 z-50 w-52 rounded-lg border border-gray-200 bg-white shadow-lg ${
                  openUpward ? "bottom-full mb-1" : "top-full mt-1"
                } animate-in fade-in zoom-in duration-200`}
              >
                <div className="py-1">
                  {/* Creator-only actions: Promote/Demote */}
                  {currentUserRole === "CREATOR" && (
                    <>
                      {meta.role === "MEMBER" && (
                        <button
                          onClick={handlePromote}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaUserShield className="h-4 w-4 flex-shrink-0 text-blue-500" />
                          <span className="font-medium">Make Admin</span>
                        </button>
                      )}
                      {meta.role === "ADMIN" && (
                        <button
                          onClick={handleDemote}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaUserMinus className="h-4 w-4 flex-shrink-0 text-orange-500" />
                          <span className="font-medium">Demote to Member</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Remove action */}
                  <button
                    onClick={handleRemove}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-orange-600 transition-colors hover:bg-gray-50"
                  >
                    <FaUserMinus className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Remove from Room</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomMemberCard;
