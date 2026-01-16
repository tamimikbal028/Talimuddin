import React from "react";
import { Link } from "react-router-dom";
import { FaFolder, FaFileAlt, FaBookmark, FaUserFriends } from "react-icons/fa";
import type { ProfileHeaderData } from "../../types";

interface ProfileTabsProps {
  activeTab: "posts" | "files";
  setActiveTab: (tab: "posts" | "files") => void;
  isOwnProfile: boolean;
  data: ProfileHeaderData;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  isOwnProfile,
  data,
}) => {
  const postsCount = data.user.postsCount || 0;
  const publicFilesCount = data.user.publicFilesCount || 0;

  return (
    <div className="rounded-t-lg border-b border-gray-200 bg-white">
      <nav className="flex justify-evenly" aria-label="Profile sections">
        {/* Posts & Public Files - always visible */}
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex cursor-pointer items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:border-black hover:text-black"
          }`}
        >
          <FaFileAlt className="mr-2 inline h-4 w-4" />
          <span>Posts</span> ({postsCount})
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={`flex cursor-pointer items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
            activeTab === "files"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:border-black hover:text-black"
          }`}
        >
          <FaFolder className="mr-2 inline h-4 w-4" />
          <span>Public Files</span> ({publicFilesCount})
        </button>

        {/* Friends & Saved - only visible to own profile */}
        {isOwnProfile && (
          <>
            <Link
              to="/friends"
              className="flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-black hover:text-black"
            >
              <FaUserFriends className="mr-2 inline h-4 w-4" />
              <span>Friends</span>
            </Link>

            <Link
              to="/profile/saved"
              className="flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-black hover:text-black"
            >
              <FaBookmark className="mr-2 inline h-4 w-4" />
              <span>Saved</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default ProfileTabs;
