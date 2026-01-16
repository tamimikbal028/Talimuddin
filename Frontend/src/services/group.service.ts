import { GROUP_LIMIT, MEMBERS_LIMIT, POST_LIMIT } from "../constants";
import api from "../lib/axios";
import type {
  MyGroupsResponse,
  GroupMembersResponse,
  FeedResponse,
  GroupDetailsResponse,
  GroupUnreadCountsResponse,
  PendingPostsResponse,
  PostActionResponse,
} from "../types";

import type { CreateGroupData } from "../types/group.types";

export const groupService = {
  // Create Group
  createGroup: async (groupData: CreateGroupData) => {
    const response = await api.post("/groups", groupData);
    return response.data;
  },

  // Get Group Details
  getGroupDetails: async (slug: string): Promise<GroupDetailsResponse> => {
    const response = await api.get<GroupDetailsResponse>(`/groups/${slug}`);
    return response.data;
  },

  // Get Group Unread Counts (lightweight API for navbar badges)
  getGroupUnreadCounts: async (
    slug: string
  ): Promise<GroupUnreadCountsResponse> => {
    const response = await api.get<GroupUnreadCountsResponse>(
      `/groups/${slug}/unread-counts`
    );
    return response.data;
  },

  // Get Group Feed
  getGroupPosts: async (slug: string, page = 1): Promise<FeedResponse> => {
    const limit = POST_LIMIT;
    const response = await api.get<FeedResponse>(`/groups/${slug}/feed`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Group Pinned Posts
  getGroupPinnedPosts: async (
    slug: string,
    page = 1
  ): Promise<FeedResponse> => {
    const limit = POST_LIMIT;
    const response = await api.get<FeedResponse>(`/groups/${slug}/pinned`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Group Marketplace Posts (BUY_SELL type)
  getGroupMarketplacePosts: async (
    slug: string,
    page = 1
  ): Promise<FeedResponse> => {
    const limit = 2;
    const response = await api.get<FeedResponse>(
      `/groups/${slug}/marketplace`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get My Groups
  getMyGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/myGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get University Groups
  getUniversityGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(
      `/groups/universityGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Career Groups
  getCareerGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/careerGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Suggested Groups
  getSuggestedGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(
      `/groups/suggestedGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Sent Requests
  getSentRequests: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/sentRequests`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Invited Groups
  getInvitedGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/invitedGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Leave Group / Reject Invite
  leaveGroup: async (slug: string) => {
    const response = await api.delete(`/groups/${slug}/leave`);
    return response.data;
  },

  // Join Group / Accept Invite
  joinGroup: async (slug: string) => {
    const response = await api.post(`/groups/${slug}/join`);
    return response.data;
  },

  // Accept Join Request (Admin)
  acceptJoinRequest: async (slug: string, userId: string) => {
    const response = await api.post(`/groups/${slug}/accept`, { userId });
    return response.data;
  },

  // Reject Join Request (Admin)
  rejectJoinRequest: async (slug: string, userId: string) => {
    const response = await api.post(`/groups/${slug}/reject`, { userId });
    return response.data;
  },

  // Cancel Join Request
  cancelJoinRequest: async (slug: string) => {
    const response = await api.post(`/groups/${slug}/cancel`);
    return response.data;
  },

  // Delete Group
  deleteGroup: async (slug: string) => {
    const response = await api.delete(`/groups/${slug}`);
    return response.data;
  },

  // Invite Members
  inviteMembers: async (slug: string, targetUserIds: string | string[]) => {
    // Backend expects an array, so we ensure it's always an array
    const ids = Array.isArray(targetUserIds) ? targetUserIds : [targetUserIds];
    const response = await api.post(`/groups/${slug}/invite`, {
      targetUserIds: ids,
    });
    return response.data;
  },

  // Remove Member (Kick)
  removeMember: async (slug: string, userId: string) => {
    const response = await api.delete(`/groups/${slug}/members/${userId}`);
    return response.data;
  },

  // Assign Admin
  assignAdmin: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/assign-admin`
    );
    return response.data;
  },

  // Revoke Admin
  revokeAdmin: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/revoke-admin`
    );
    return response.data;
  },

  // Promote to Moderator
  promoteToModerator: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/promote-moderator`
    );
    return response.data;
  },

  // Promote to Admin
  promoteToAdmin: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/promote-admin`
    );
    return response.data;
  },

  // Demote to Moderator
  demoteToModerator: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/demote-moderator`
    );
    return response.data;
  },

  // Demote to Member
  demoteToMember: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/demote-member`
    );
    return response.data;
  },

  // Transfer Ownership
  transferOwnership: async (slug: string, userId: string) => {
    const response = await api.patch(
      `/groups/${slug}/members/${userId}/transfer-ownership`
    );
    return response.data;
  },

  // Ban Member
  banMember: async (slug: string, userId: string) => {
    const response = await api.patch(`/groups/${slug}/members/${userId}/ban`);
    return response.data;
  },

  // Get Group Members
  getGroupMembers: async (
    slug: string,
    page = 1,
    status: string
  ): Promise<GroupMembersResponse> => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get<GroupMembersResponse>(
      `/groups/${slug}/members`,
      {
        params: { page, limit, status },
      }
    );
    return response.data;
  },

  // Update Group Details
  updateGroupDetails: async (
    slug: string,
    updateData: Partial<CreateGroupData>
  ) => {
    const response = await api.patch(`/groups/${slug}/details`, updateData);
    return response.data;
  },

  // Update Group Avatar
  updateGroupAvatar: async (slug: string, avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await api.patch(`/groups/${slug}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update Group Cover Image
  updateGroupCoverImage: async (slug: string, coverImage: File) => {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch(`/groups/${slug}/cover-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  // Update Member Settings
  updateMemberSettings: async (
    slug: string,
    settings: {
      isMuted?: boolean;
      isFollowing?: boolean;
      isPinned?: boolean;
      isFavorite?: boolean;
    }
  ) => {
    const response = await api.patch(
      `/groups/${slug}/membership/settings`,
      settings
    );
    return response.data;
  },

  // Post Moderation
  getPendingPosts: async (
    slug: string,
    page: number = 1
  ): Promise<PendingPostsResponse> => {
    const response = await api.get(`/groups/${slug}/pending-posts`, {
      params: { page, limit: 10 },
    });
    return response.data;
  },

  approvePost: async (
    slug: string,
    postId: string
  ): Promise<PostActionResponse> => {
    const response = await api.patch(`/groups/${slug}/posts/${postId}/approve`);
    return response.data;
  },

  rejectPost: async (
    slug: string,
    postId: string
  ): Promise<PostActionResponse> => {
    const response = await api.patch(`/groups/${slug}/posts/${postId}/reject`);
    return response.data;
  },
};
