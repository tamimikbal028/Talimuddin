import React from "react";
import {
  FaLock,
  FaArrowLeft,
  FaShieldAlt,
  FaUserLock,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  GROUP_PRIVACY,
  GROUP_MEMBERSHIP_STATUS,
} from "../../../constants/index.js";
import type { Group, GroupMeta } from "../../../types/group.types";
import { groupHooks } from "../../../hooks/useGroup";

interface GroupAccessDeniedProps {
  group: Group;
  meta: GroupMeta;
}

const GroupAccessDenied: React.FC<GroupAccessDeniedProps> = ({
  group,
  meta,
}) => {
  const navigate = useNavigate();
  const { mutate: joinGroup, isPending: isJoining } = groupHooks.useJoinGroup();
  const { mutate: cancelRequest, isPending: isCancelling } =
    groupHooks.useCancelJoinRequest();

  const { name: groupName, privacy } = group;
  const isClosed = privacy === GROUP_PRIVACY.CLOSED;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        {/* Icon Container with Animated Pulse */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <div className="absolute h-full w-full animate-ping rounded-full bg-red-100 opacity-20"></div>
          {isClosed ? (
            <FaUserLock className="relative z-10 text-4xl text-red-500" />
          ) : (
            <FaLock className="relative z-10 text-4xl text-red-500" />
          )}
          <div className="absolute -top-1 -right-1 rounded-full bg-white p-1.5 shadow-sm">
            {isClosed ? (
              <FaEyeSlash className="text-sm text-gray-400" />
            ) : (
              <FaShieldAlt className="text-sm text-gray-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Access Restricted
        </h2>
        <p className="mb-6 text-gray-500">
          {isClosed ? (
            <>
              This is a <strong>Closed Group</strong>.
              <br />
              Only members can view the content.
            </>
          ) : (
            <>
              This is a <strong>Private Group</strong>.
              <br />
              Join the group to view its posts and members.
            </>
          )}
        </p>

        {/* Group Name Badge */}
        <div className="mb-8 inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600">
          {groupName}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {meta.status === GROUP_MEMBERSHIP_STATUS.PENDING ? (
            <button
              onClick={() => cancelRequest({ slug: group.slug })}
              disabled={isCancelling}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Cancel Request"}
            </button>
          ) : !meta.status ? (
            <button
              onClick={() => joinGroup({ slug: group.slug })}
              disabled={isJoining}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {isJoining ? "Joining..." : "Join Group"}
            </button>
          ) : null}

          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/groups/suggested")}
            className="w-full rounded-xl border border-gray-500 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Explore Other Groups
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAccessDenied;


