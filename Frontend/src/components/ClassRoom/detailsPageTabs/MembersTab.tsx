import React from "react";
import UserCard from "../../shared/users/UserCard";
import { showError } from "../../../utils/sweetAlert";
import { showMemberMenu } from "../../../utils/customModals";
import type { User } from "../../../types";

// TODO: Replace with API types
type UserData = {
  id: string;
  name: string;
  avatar?: string;
};

type RoomMember = {
  userId: string;
  roomId: string;
  role: "creator" | "admin" | "member";
};

interface Props {
  roomId: string;
  users: UserData[];
  members: RoomMember[];
  currentUserId?: string;
  // admin and member management callbacks (optional)
  onRemoveMember?: (id: string) => void;
  onMakeAdmin?: (id: string) => void;
  onRemoveAdmin?: (id: string) => void;
}

const MembersTab: React.FC<Props> = ({
  roomId,
  users,
  members,
  currentUserId,
  onRemoveMember,
  onMakeAdmin,
  onRemoveAdmin,
}) => {
  const currentUser = users.find((u) => u.id === currentUserId);

  // Filter room members
  const roomMembers = members.filter((m) => m.roomId === roomId);

  // Extract creator and admins from room members
  const creator = roomMembers.find((m) => m.role === "creator");
  const creatorId = creator?.userId;
  const admins = roomMembers
    .filter((m) => m.role === "admin" || m.role === "creator")
    .map((m) => m.userId);

  const handleMemberMenu = async (
    userId: string,
    userName?: string,
    isAdmin?: boolean
  ) => {
    const isCreator =
      !!currentUser && !!creatorId && currentUser.id === creatorId;

    // Only creator can manage admin status
    const showAdminBtn = isCreator;

    // Determine who can remove this member:
    // - Creator can remove anyone (except themselves, but that's already filtered)
    // - Regular admin can only remove non-admin members
    const isCurrentUserAdmin =
      !!currentUser && !!admins && admins.includes(currentUser.id);
    const canRemove = isCreator || (isCurrentUserAdmin && !isAdmin);

    await showMemberMenu(userName ?? "Member", {
      onRemove: canRemove
        ? () => {
            if (onRemoveMember) onRemoveMember(userId);
          }
        : undefined,
      onMakeAdmin:
        showAdminBtn && !isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== creatorId) {
                showError({
                  title: "Not allowed",
                  text: "Only the room creator can change admin status.",
                });
                return;
              }
              if (onMakeAdmin) onMakeAdmin(userId);
            }
          : undefined,
      onRemoveAdmin:
        showAdminBtn && isAdmin
          ? () => {
              if (!currentUser || currentUser.id !== creatorId) {
                showError({
                  title: "Not allowed",
                  text: "Only the room creator can change admin status.",
                });
                return;
              }
              if (onRemoveAdmin) onRemoveAdmin(userId);
            }
          : undefined,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Members ({roomMembers?.length || 0})
      </h2>
      <div className="mt-3 space-y-2.5">
        {roomMembers &&
          roomMembers.map((membership) => {
            const user = users.find((u) => u.id === membership.userId);
            if (!user) return null;

            const isAdmin = !!admins && admins.includes(user.id);

            const isCurrentUserCreator =
              !!currentUser && !!creatorId && currentUser.id === creatorId;
            const isCurrentUserAdmin =
              !!currentUser && !!admins && admins.includes(currentUser.id);

            const canShowMenu =
              (isCurrentUserCreator || isCurrentUserAdmin) &&
              user.id !== creatorId &&
              user.id !== currentUser?.id;

            // Convert UserData to User type for UserCard
            const userForCard: User = {
              _id: user.id,
              fullName: user.name,
              userName: user.id, // TODO: Get actual userName from API
              avatar: user.avatar || "",
              email: "",
              coverImage: "",
              postsCount: 0,
              connectionsCount: 0,
              followersCount: 0,
              followingCount: 0,
              publicFilesCount: 0,
              userType: "normal",
              accountStatus: "ACTIVE",
              restrictions: {
                isCommentBlocked: false,
                isPostBlocked: false,
                isMessageBlocked: false,
              },
              agreedToTerms: true,
              createdAt: "",
              updatedAt: "",
            };

            return (
              <UserCard
                key={user.id}
                user={userForCard}
                canShowMenu={canShowMenu}
                handleMemberMenu={(userId, userName) =>
                  handleMemberMenu(userId, userName, isAdmin)
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default MembersTab;
