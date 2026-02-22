import { Routes, Route, Link } from "react-router-dom";
import { branchHooks } from "../../hooks/useBranch";
import { authHooks } from "../../hooks/useAuth";
import BranchHeader from "../../components/Branch/details-page/BranchHeader";
import BranchPosts from "../../components/Branch/details-page-tabs/BranchPosts";
import BranchMembersTab from "../../components/Branch/details-page-tabs/BranchMembersTab";
import BranchRequestsTab from "../../components/Branch/details-page-tabs/BranchRequestsTab";
import BranchDetailsSkeleton from "../../components/shared/skeletons/BranchDetailsSkeleton";
import { FaDoorOpen } from "react-icons/fa";

const BranchDetails = () => {
  const { isAppAdmin } = authHooks.useUser();
  const { data: response, isLoading, error } = branchHooks.useBranchDetails();

  if (isLoading) {
    return <BranchDetailsSkeleton />;
  }

  if (error || !response) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-gray-200 bg-gray-50 py-5">
        <span className="font-semibold text-red-700">
          {error?.message || "Branch Not Available"}
        </span>
        <Link
          to="/branch"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <FaDoorOpen className="h-4 w-4" />
          Back to Branches
        </Link>
      </div>
    );
  }

  const branch = response.data.branch;
  const meta = response.data.meta;

  const isApprovedMember = meta.isMember || isAppAdmin;

  if (meta.isPending) {
    return (
      <div className="space-y-5">
        <BranchHeader branch={branch} meta={meta} />
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-10 text-center">
          <h2 className="text-2xl font-bold text-amber-900">Request Pending</h2>
          <p className="mt-2 text-amber-700">
            Your request to join this branch is waiting for approval from an
            admin.
          </p>
        </div>
      </div>
    );
  }

  if (!isApprovedMember) {
    return (
      <div className="space-y-5">
        <BranchHeader branch={branch} meta={meta} />

        <h2 className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 py-10 text-center text-2xl font-bold text-gray-900">
          You are not a member of this branch.
        </h2>
      </div>
    );
  }

  // Member or Authorized - Show full branch details
  return (
    <div className="space-y-5 overflow-hidden">
      <BranchHeader branch={branch} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl shadow">
          <Routes>
            <Route index element={<BranchPosts />} />
            <Route path="members" element={<BranchMembersTab />} />
            {(meta.isBranchAdmin || isAppAdmin) && (
              <Route path="requests" element={<BranchRequestsTab />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;
