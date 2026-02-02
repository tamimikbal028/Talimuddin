import {
  PotrikaHeader,
  PotrikaPosts,
  CreatePotrikaPost,
  PotrikaNotFound,
} from "../../components/Potrika";
import { authHooks } from "../../hooks/useAuth";
import { potrikaHooks } from "../../hooks/usePotrika";
import ProfileHeaderSkeleton from "../../components/shared/skeletons/ProfileHeaderSkeleton";

const PotrikaDetail = () => {
  const { isAppAdmin } = authHooks.useUser();

  const { data, isLoading, error } = potrikaHooks.usePotrikaHeader();

  // Show loading state
  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  // Show error state
  if (error || !data) {
    return <PotrikaNotFound />;
  }

  const { potrika } = data.data;

  return (
    <div className="space-y-4">
      <PotrikaHeader data={potrika} />

      <div className="space-y-3">
        {isAppAdmin && (
          <div className="mb-4">
            <CreatePotrikaPost />
          </div>
        )}
        <PotrikaPosts potrikaId={potrika._id} />
      </div>
    </div>
  );
};

export default PotrikaDetail;
