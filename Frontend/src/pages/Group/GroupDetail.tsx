import React from "react";
import { Routes, Route } from "react-router-dom";
import GroupMediaTab from "../../components/Groups/group-tabs-inside/GroupMediaTab";
import GroupAboutTab from "../../components/Groups/GroupAboutTab";
import { groupHooks } from "../../hooks/useGroup";
import GroupAccessDenied from "../../components/Groups/utils/GroupAccessDenied";
import GroupBanned from "../../components/Groups/utils/GroupBanned";
import GroupHeader from "../../components/Groups/GroupHeader";
import GroupNavBar from "../../components/Groups/GroupNavBar";
import CreateGroupPost from "../../components/Groups/CreateGroupPost";
import GroupPosts from "../../components/Groups/group-tabs-inside/GroupPosts";
import GroupPinnedPosts from "../../components/Groups/group-tabs-inside/GroupPinnedPosts";
import GroupMembersTab from "../../components/Groups/group-tabs-inside/GroupMembersTab";
import GroupNotFound from "../../components/Groups/utils/GroupNotFound";
import GroupLoading from "../../components/Groups/utils/GroupLoading";
import Marketplace from "../../components/Groups/group-tabs-inside/Marketplace";
import GroupRequestsTab from "../../components/Groups/group-tabs-inside/GroupRequestsTab";
import GroupModerationTab from "../../components/Groups/group-tabs-inside/GroupModerationTab";

const GroupDetail: React.FC = () => {
  const { data: response, isLoading, error } = groupHooks.useGroupDetails();
  // const error = apiError; // Uncomment this line and remove above block to revert
  const group = response?.data?.group;
  const meta = response?.data?.meta;

  // Loading State
  if (isLoading) {
    return <GroupLoading />;
  }

  // Error State or Not Found
  if (error || !group || !meta) {
    return <GroupNotFound error={error} />;
  }

  // Access Control Check
  if (meta.isBanned) {
    return <GroupBanned group={group} />;
  }

  if (meta.isRestricted) {
    return <GroupAccessDenied group={group} meta={meta} />;
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <GroupHeader group={group} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl shadow">
          <GroupNavBar meta={meta} />

          <div className="space-y-3">
            <Routes>
              <Route
                index
                element={
                  <>
                    {meta.isMember &&
                      (group.settings.allowMemberPosting ||
                        meta.isOwner ||
                        meta.isAdmin ||
                        meta.isModerator) && (
                        <CreateGroupPost groupId={group._id} />
                      )}
                    <GroupPosts />
                  </>
                }
              />
              <Route path="pinned" element={<GroupPinnedPosts />} />
              <Route path="members" element={<GroupMembersTab />} />
              <Route path="media" element={<GroupMediaTab />} />
              <Route path="requests" element={<GroupRequestsTab />} />
              <Route path="moderation" element={<GroupModerationTab />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="about" element={<GroupAboutTab group={group} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;


