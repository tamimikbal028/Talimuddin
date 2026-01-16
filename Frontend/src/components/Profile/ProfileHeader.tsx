import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaInfoCircle, FaEllipsisV, FaLink } from "react-icons/fa";
import type { ProfileHeaderData } from "../../types";
import { toast } from "sonner";
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

  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
    closeMenu();
  };

  // Render action buttons based on relationStatus
  const renderActionButtons = () => {
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
