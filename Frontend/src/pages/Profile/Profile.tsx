import {
  ProfileHeader,
  ProfilePosts,
  CreateProfilePost,
  ProfileNotFound,
} from "../../components/Profile";
import { authHooks } from "../../hooks/useAuth";
import { profileHooks } from "../../hooks/useProfile";
import ProfileHeaderSkeleton from "../../components/shared/skeletons/ProfileHeaderSkeleton";

const Profile = () => {
  const { isAppAdmin } = authHooks.useUser();

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

  const { user } = profileData;

  return (
    <>
      <ProfileHeader data={profileData} />

      <div className="space-y-3">
        {isAppAdmin && (
          <div className="mb-4">
            <CreateProfilePost />
          </div>
        )}
        <ProfilePosts username={user.userName} />
      </div>
    </>
  );
};

export default Profile;
