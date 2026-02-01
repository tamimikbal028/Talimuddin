import { useParams } from "react-router-dom";
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
  const { username } = useParams<{ username: string }>();

  const { user: currentUser, isAppAdmin } = authHooks.useUser();

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
  const isOwnProfile = username === currentUser?.userName;

  return (
    <>
      <ProfileHeader data={profileData} />

      <div className="space-y-3">
        {!isAppAdmin ? (
          <>
            {isOwnProfile && (
              <div className="mb-4">
                <CreateProfilePost />
              </div>
            )}
            <ProfilePosts
              username={user.userName}
              isOwnProfile={isOwnProfile}
            />
          </>
        ) : (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center shadow-sm">
            <p>You are not authorized to create posts.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
