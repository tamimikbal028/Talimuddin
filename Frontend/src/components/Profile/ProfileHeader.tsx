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
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        {/* Avatar, Name, Stats and Edit Button */}
        <div className="flex items-start gap-4">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-24 w-24 rounded-lg border-2 border-gray-200 object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.fullName}
                </h1>
                <div className="mt-1 inline-flex items-center gap-1 text-gray-600">
                  <span className="font-semibold">
                    {userData.postsCount || 0}
                  </span>
                  <span className="text-sm font-medium">
                    {userData.postsCount <= 1 ? "Post" : "Posts"}
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {(userData.bio || isOwnProfile) && (
          <div className="mt-4">
            <p className="text-sm leading-relaxed font-medium text-gray-600">
              {userData.bio ||
                (isOwnProfile && (
                  <span className="text-gray-600">
                    Add a bio to tell people about yourself
                  </span>
                ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
