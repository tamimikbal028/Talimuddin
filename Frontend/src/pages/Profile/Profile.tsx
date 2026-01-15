import React from "react";
import { useParams } from "react-router-dom";
import { authHooks } from "../../hooks/useAuth";
import { profileHooks } from "../../hooks/useProfile";
import ProfileHeaderSkeleton from "../../components/shared/skeletons/ProfileHeaderSkeleton";
import ProfileNotFound from "../../components/Profile/ProfileNotFound";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import CreateProfilePost from "../../components/Profile/CreateProfilePost";
import ProfilePosts from "../../components/Profile/ProfilePosts";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { user: currentUser } = authHooks.useUser();

  const profileUsername = !username ? currentUser?.userName : username;

  const {
    data: profileData,
    isLoading,
    error,
  } = profileHooks.useProfileHeader(profileUsername || "");

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !profileData || !profileUsername) {
    return <ProfileNotFound />;
  }

  const { user, meta } = profileData;
  const isOwnProfile = meta?.isOwnProfile ?? username === currentUser?.userName;

  return (
    <>
      <ProfileHeader data={profileData} />

      <div className="space-y-3">
        {/* Create Post Section (Only for Own Profile) */}
        {isOwnProfile && currentUser?._id && (
          <div className="mb-4">
            <CreateProfilePost />
          </div>
        )}
        <ProfilePosts username={user.userName} isOwnProfile={isOwnProfile} />
      </div>
    </>
  );
};

export default Profile;
