import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
  ProfileTabs,
  CreateProfilePost,
  ProfileNotFound,
} from "../../components/Profile";
import { authHooks } from "../../hooks/useAuth";
import { profileHooks } from "../../hooks/useProfile";
import ProfileHeaderSkeleton from "../../components/shared/skeletons/ProfileHeaderSkeleton";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");

  const { user: currentUser } = authHooks.useUser();

  const {
    data: profileData,
    isLoading,
    error,
  } = profileHooks.useProfileHeader();

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !profileData) {
    return <ProfileNotFound />;
  }

  const { user, meta } = profileData;
  const isOwnProfile = meta?.isOwnProfile ?? username === currentUser?.userName;

  return (
    <>
      <ProfileHeader data={profileData} />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnProfile={isOwnProfile}
        data={profileData}
      />

      {/* Tab Content */}
      <div>
        {activeTab === "posts" && (
          <div className="space-y-3">
            {/* Create Post Section (Only for Own Profile) */}
            {isOwnProfile && currentUser?._id && (
              <div className="mb-4">
                <CreateProfilePost />
              </div>
            )}
            <ProfilePosts
              username={user.userName}
              isOwnProfile={isOwnProfile}
            />
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-3">
            <PublicFiles username={user.userName} isOwnProfile={isOwnProfile} />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
