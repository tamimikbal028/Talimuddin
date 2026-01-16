import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ProfileHeader,
  ProfilePosts,
  PublicFiles,
  ProfileTabs,
  CreateProfilePost,
  ProfileNotFound,
  ProfileBlocked,
} from "../../components/Profile";
import { authHooks } from "../../hooks/useAuth";
import { profileHooks } from "../../hooks/useProfile";
import { friendshipHooks } from "../../hooks/useFriendship";
import ProfileHeaderSkeleton from "../../components/shared/skeletons/ProfileHeaderSkeleton";
import confirm from "../../utils/sweetAlert";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "files">("posts");

  const { user: currentUser } = authHooks.useUser();
  const { mutate: unblockUser } = friendshipHooks.useUnblockUser();

  const profileUsername = !username ? currentUser?.userName : username;

  const {
    data: profileData,
    isLoading,
    error,
  } = profileHooks.useProfileHeader(profileUsername);

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !profileData) {
    return <ProfileNotFound />;
  }

  const { user, meta } = profileData;
  const isOwnProfile = meta?.isOwnProfile ?? username === currentUser?.userName;

  const handleUnblock = async () => {
    const ok = await confirm({
      title: "Unblock User?",
      text: "You will be able to send friend requests or follow this user again.",
      confirmButtonText: "Yes, unblock",
      icon: "question",
    });

    if (ok) {
      unblockUser({ userId: user._id });
    }
  };

  // 🚫 BLOCKED VIEW HANDLER
  if (meta.isBlockedByMe || meta.isBlockedByTarget) {
    return (
      <ProfileBlocked
        fullName={user.fullName}
        isBlockedByMe={!!meta.isBlockedByMe}
        onUnblock={meta.isBlockedByMe ? handleUnblock : undefined}
      />
    );
  }

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




