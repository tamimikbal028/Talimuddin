import React from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import type { ProfileHeaderData } from "../../types";
import { authHooks } from "../../hooks/useAuth";

const ProfileHeader: React.FC<{ data: ProfileHeaderData }> = ({ data }) => {
  const { user: userData } = data;
  const { user: currentUser } = authHooks.useUser();
  const isOwnProfile = currentUser?._id === userData._id;

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 md:h-64">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="h-full w-full object-cover"
        />

        {/* Profile Stats - positioned on right side of cover */}
        <div className="absolute right-3 bottom-3 hidden md:block">
          <div className="grid grid-cols-2 divide-x divide-gray-300 rounded-lg border border-gray-200 bg-white py-2 opacity-75 shadow-lg backdrop-blur">
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                {userData.postsCount || 0}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {userData.postsCount === 1 ? "Post" : "Posts"}
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
          {isOwnProfile && (
            <div className="pt-4">
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <FaEdit className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
