import React from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaUniversity,
  FaInfoCircle,
  FaGraduationCap,
  FaEllipsisV,
  FaLink,
  FaBan,
} from "react-icons/fa";
import FriendshipActionButtons from "../shared/friends/FriendshipActionButtons";
import confirm from "../../utils/sweetAlert";
import { friendshipHooks } from "../../hooks/useFriendship";
import { FOLLOW_TARGET_MODELS } from "../../constants";
import type { ProfileHeaderData } from "../../types";
import { toast } from "sonner";
import { profileHooks } from "../../hooks/useProfile";
import { useDropdown } from "../../hooks/useDropdown";

const ProfileHeader: React.FC<{ data: ProfileHeaderData }> = ({ data }) => {
  const { user: userData, meta } = data;
  const { isOwnProfile } = meta;
  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const institutionName = userData.institution?.name;
  const departmentName = userData.academicInfo?.department?.name;

  // Hooks for friendship actions (kept unblock for the blocked banner if needed, or rely on component)
  const { mutate: blockUser } = friendshipHooks.useBlockUser();
  const { mutate: unblockUser, isPending: isUnblocking } =
    friendshipHooks.useUnblockUser();

  // Hook for follow actions
  const { mutate: toggleFollow, isPending: isFollowPending } =
    profileHooks.useToggleFollowProfile();

  const isFollowing = meta.isFollowing;

  // Handle follow actions
  const handleToggleFollow = (targetId: string) => {
    toggleFollow({ targetId, targetModel: FOLLOW_TARGET_MODELS.USER });
  };

  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
    closeMenu();
  };

  const handleBlock = async () => {
    const ok = await confirm({
      title: "Block User?",
      text: "All existing relationships (friendship, follows) will be removed. You won't see each other's updates.",
      confirmButtonText: "Yes, block",
      icon: "warning",
    });

    if (ok) {
      blockUser({ userId: userData._id });
      closeMenu();
    }
  };

  const handleUnblock = async () => {
    const ok = await confirm({
      title: "Unblock User?",
      text: "You will be able to send friend requests or follow this user again.",
      confirmButtonText: "Yes, unblock",
      icon: "question",
    });

    if (ok) {
      unblockUser({ userId: userData._id });
    }
  };

  // Render action buttons based on relationStatus
  const renderActionButtons = () => {
    // 1. BLOCKED BY ME - Custom banner but can use component if we want unblock button
    if (meta.isBlockedByMe) {
      return (
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
            You blocked this user
          </span>
          <button
            onClick={handleUnblock}
            disabled={isUnblocking}
            className="rounded-md bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUnblocking ? "Unblocking..." : "Unblock"}
          </button>
        </div>
      );
    }

    // 2. BLOCKED BY TARGET
    if (meta.isBlockedByTarget) {
      return (
        <span className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500">
          {userData.fullName} blocked you
        </span>
      );
    }

    if (isOwnProfile) {
      return (
        <>
          {/* edit and details buttons */}
          <div className="flex gap-3">
            {/* edit button */}
            <Link
              to="/profile/edit"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <FaEdit className="h-4 w-4" />
              Edit Profile
            </Link>
            {/* details button */}
            <Link
              to="/profile/details"
              className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
            >
              <FaInfoCircle className="h-4 w-4" />
              Details
            </Link>
          </div>
        </>
      );
    }

    // Other user's profile
    return (
      <div className="flex items-center gap-3">
        {/* Unified Friendship Actions */}
        <FriendshipActionButtons
          userId={userData._id}
          user_relation_status={meta.user_relation_status}
        />

        {/* Follow/Unfollow Button */}
        <button
          onClick={() => handleToggleFollow(userData._id)}
          disabled={isFollowPending}
          className={`flex items-center gap-2 rounded-md px-6 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isFollowing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFollowPending
            ? "Processing..."
            : isFollowing
              ? "Unfollow"
              : "Follow"}
        </button>

        {/* View Details button - at far right */}
        <Link
          to={`/profile/${userData.userName}/details`}
          className="flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
        >
          <FaInfoCircle className="h-4 w-4" />
          Details
        </Link>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 md:h-64">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="h-full w-full object-cover"
        />

        {/* 3-Dot Menu - positioned over cover */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="rounded-full bg-white/90 p-2 text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white focus:outline-none"
          >
            <FaEllipsisV className="h-5 w-5" />
          </button>

          {showMenu && (
            <div
              className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                openUpward ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            >
              <div className="py-1">
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="font-medium">Copy profile link</span>
                </button>
                {!isOwnProfile &&
                  !meta.isBlockedByMe &&
                  !meta.isBlockedByTarget && (
                    <button
                      onClick={handleBlock}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                    >
                      <FaBan className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Block user</span>
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Stats - positioned on right side of cover */}
        <div className="absolute right-3 bottom-3 hidden md:block">
          <div className="grid grid-cols-4 divide-x divide-gray-300 rounded-lg border border-gray-200 bg-white py-2 opacity-75 shadow-lg backdrop-blur">
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {userData.postsCount || 0}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {userData.postsCount === 1 ? "Post" : "Posts"}
              </p>
            </div>
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {userData.connectionsCount || 0}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {userData.connectionsCount === 1 ? "Friend" : "Friends"}
              </p>
            </div>
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {userData.followersCount || 0}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {userData.followersCount === 1 ? "Follower" : "Followers"}
              </p>
            </div>
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {userData.followingCount || 0}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {userData.followingCount === 1 ? "Following" : "Followings"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative px-5 pb-5">
        {/* Avatar - overlaying the cover */}
        <div className="relative -mt-16 mb-4 md:-mt-20">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl md:h-40 md:w-40"
          />
        </div>

        {/* Profile Info */}
        <div>
          <div>
            <h1 className="mb-1 text-3xl leading-tight font-bold text-gray-900">
              {userData.fullName}
            </h1>

            {/* Institution & Department */}
            <div className="mt-1 space-y-1">
              <p className="flex items-center gap-2 text-sm text-gray-600 md:text-base">
                <FaUniversity className="h-4 w-4 text-blue-700" />
                <span className={`font-medium text-gray-500 italic`}>
                  {institutionName || "No institution added"}
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600 md:text-base">
                <FaGraduationCap className="h-4 w-4 text-green-700" />
                <span className={`font-medium text-gray-500 italic`}>
                  {departmentName || "No department added"}
                </span>
              </p>
            </div>

            {/* Bio */}
            <p className="mt-3 max-w-prose text-base leading-relaxed font-medium text-gray-500">
              {userData.bio ||
                (isOwnProfile
                  ? "Add a bio to tell people about yourself"
                  : "No bio added yet")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3">{renderActionButtons()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
