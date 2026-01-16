import React from "react";
import GroupCard from "../Groups/utils/GroupCard";
import type { SearchGroup } from "../../types";

interface GroupsResultsProps {
  isVisible: boolean;
  groups?: SearchGroup[];
}

const GroupsResults: React.FC<GroupsResultsProps> = ({
  isVisible,
  groups = [],
}) => {
  if (!isVisible) return null;
  if (groups.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group._id}
            group={{
              _id: group._id,
              name: group.name,
              slug: group.slug, // Now requested from backend
              description: group.description,
              coverImage: group.avatar,
              type: group.type,
              privacy: group.privacy,
              membersCount: group.membersCount,
              postsCount: group.postsCount,
            }}
            meta={{
              status: group.userMembership || null,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupsResults;
