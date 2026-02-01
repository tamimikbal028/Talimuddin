import {
  PotrikaHeader,
  PotrikaPosts,
  CreatePotrikaPost,
  PotrikaNotFound,
} from "../components/Potrika";
import { authHooks } from "../hooks/useAuth";
import { potrikaHooks } from "../hooks/usePotrika";
import ProfileHeaderSkeleton from "../components/shared/skeletons/ProfileHeaderSkeleton";

const Potrika = () => {
  const { isAppAdmin } = authHooks.useUser();

  const {
    data: potrikaData,
    isLoading,
    error,
  } = potrikaHooks.usePotrikaHeader();

  // Show loading state
  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  // Show error state
  if (error || !potrikaData) {
    return <PotrikaNotFound />;
  }

  const { potrika } = potrikaData;

  // Only app owner and admin can create posts
  const canCreatePost = isAppAdmin;

  return (
    <>
      <PotrikaHeader data={potrikaData} />

      <div className="space-y-3">
        {canCreatePost && (
          <div className="mb-4">
            <CreatePotrikaPost />
          </div>
        )}
        <PotrikaPosts potrikaId={potrika._id} />
      </div>
    </>
  );
};

export default Potrika;
