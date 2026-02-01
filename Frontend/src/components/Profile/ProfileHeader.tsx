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
      <div className="p-5">
        {/* Avatar, Name, Stats and Edit Button */}
        <div className="flex items-start gap-4">
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className="h-24 w-24 rounded-lg border-2 border-gray-200 object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.fullName}
                </h1>{" "}
                <p className="mt-2 text-sm leading-relaxed font-medium text-gray-600">
                  {userData.bio ? `${userData.bio}` : "No bio added yet."}
                </p>
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
      </div>
    </div>
  );
};

export default ProfileHeader;
