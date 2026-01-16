import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { groupService } from "../services/group.service";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError } from "../types";
import { postHooks } from "./common/usePost";
import { commentHooks } from "./common/useComment";
import type {
  CreateGroupData,
  GroupDetailsResponse,
} from "../types/group.types";

const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (groupData: CreateGroupData) =>
      groupService.createGroup(groupData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });

      const groupSlug = data.data.group?.slug;
      navigate(`/groups/${groupSlug}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

const useMyGroups = () => {
  return useInfiniteQuery({
    queryKey: ["myGroups", "infinite"],
    queryFn: ({ pageParam }) => groupService.getMyGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useUniversityGroups = () => {
  return useInfiniteQuery({
    queryKey: ["universityGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getUniversityGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useCareerGroups = () => {
  return useInfiniteQuery({
    queryKey: ["careerGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getCareerGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useSuggestedGroups = () => {
  return useInfiniteQuery({
    queryKey: ["suggestedGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getSuggestedGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useSentGroupRequests = () => {
  return useInfiniteQuery({
    queryKey: ["sentGroupRequests", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getSentRequests(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useInvitedGroups = () => {
  return useInfiniteQuery({
    queryKey: ["invitedGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getInvitedGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

const useGroupDetails = () => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupDetails", slug],
    queryFn: async () => await groupService.getGroupDetails(slug as string),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};

// Lightweight hook for navbar unread counts
const useGroupUnreadCounts = () => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupUnreadCounts", slug],
    queryFn: async () =>
      await groupService.getGroupUnreadCounts(slug as string),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!slug,
  });
};

const useGroupMembers = (status: string) => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupMembers", slug, status],
    queryFn: ({ pageParam }) =>
      groupService.getGroupMembers(slug as string, pageParam as number, status),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: Infinity,
  });
};

const useAcceptJoinRequest = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      groupService.acceptJoinRequest(slug as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupUnreadCounts", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    },
  });
};

const useRejectJoinRequest = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      groupService.rejectJoinRequest(slug as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupUnreadCounts", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    },
  });
};
const usePendingPosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupPendingPosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getPendingPosts(slug as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
  });
};

const useApprovePost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      groupService.approvePost(slug as string, postId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupPendingPosts", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupUnreadCounts", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupPosts", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupPinnedPosts", slug] });
      queryClient.invalidateQueries({
        queryKey: ["groupMarketplacePosts", slug],
      });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to approve post");
    },
  });
};

const useRejectPost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      groupService.rejectPost(slug as string, postId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupPendingPosts", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupUnreadCounts", slug] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to reject post");
    },
  });
};

// ====================================
// Group Feed & Posts
// ====================================

const useGroupPosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupPosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupPosts(slug as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

const useGroupPinnedPosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupPinnedPosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupPinnedPosts(slug as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useGroupMarketplacePosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupMarketplacePosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupMarketplacePosts(
        slug as string,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

const useCreateGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupDetails", slug],
    ],
  });
};

const useCreateMarketplacePost = () => {
  const { slug } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["groupMarketplacePosts", slug],
      ["groupPosts", slug], // Main Posts tab also needs to refresh
      ["groupDetails", slug],
    ],
  });
};

// Group Post Like Toggle - Using Common Hook with multiple invalidateKeys
const useToggleLikeGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useToggleLikePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Delete - Using Common Hook with multiple invalidateKeys
const useDeleteGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
      ["groupDetails", slug],
    ],
  });
};

// Group Post Update - Using Common Hook with multiple invalidateKeys
const useUpdateGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Read Status Toggle - Using Common Hook with multiple queryKeys
const useToggleReadStatusGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
    invalidateKey: [["groupUnreadCounts", slug]],
  });
};

// Group Post Bookmark Toggle - Using Common Hook with multiple invalidateKeys
const useToggleBookmarkGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Pin Toggle - Using Common Hook with multiple invalidateKeys
const useTogglePinGroupPost = () => {
  const { slug } = useParams();
  return postHooks.useTogglePin({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
      ["groupUnreadCounts", slug], // Invalidate unread counts on pin/unpin
    ],
  });
};

// ====================================
// Action Button Hooks
// ====================================

const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => groupService.joinGroup(slug),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers", slug] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => groupService.leaveGroup(slug),

    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers", slug] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) =>
      groupService.cancelJoinRequest(slug),

    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => groupService.deleteGroup(slug),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      navigate("/groups");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useInviteMembers = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ targetUserIds }: { targetUserIds: string[] }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.inviteMembers(slug, targetUserIds);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useRemoveGroupMember = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.removeMember(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useAssignGroupAdmin = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.assignAdmin(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useRevokeGroupAdmin = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.revokeAdmin(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const usePromoteToModerator = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.promoteToModerator(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const usePromoteToAdmin = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.promoteToAdmin(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useDemoteToModerator = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.demoteToModerator(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useDemoteToMember = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.demoteToMember(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useTransferOwnership = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.transferOwnership(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const useBanMember = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.banMember(slug, userId);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// ====================================
// Group Comment Hooks
// ====================================

const useAddGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return commentHooks.useAddComment({
    postId,
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

const useDeleteGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return commentHooks.useDeleteComment({
    postId,
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

const useUpdateGroupDetails = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ updateData }: { updateData: Partial<CreateGroupData> }) => {
      return groupService.updateGroupDetails(slug as string, updateData);
    },
    onSuccess: () => {
      toast.success("Group details updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update group details"
      );
    },
  });
};

const useUpdateGroupAvatar = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avatar }: { avatar: File }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.updateGroupAvatar(slug, avatar);
    },
    onSuccess: () => {
      toast.success("Avatar updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
    },
  });
};

const useUpdateGroupCoverImage = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coverImage }: { coverImage: File }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.updateGroupCoverImage(slug, coverImage);
    },
    onSuccess: () => {
      toast.success("Cover image updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update cover image"
      );
    },
  });
};

const useUpdateMemberSettings = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      settings,
    }: {
      settings: {
        isMuted?: boolean;
        isFollowing?: boolean;
        isPinned?: boolean;
      };
    }) => {
      if (!slug) throw new Error("Slug not found");
      return groupService.updateMemberSettings(slug, settings);
    },
    onMutate: async ({ settings }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["groupDetails", slug] });

      // 1. Optimistically update Group Details
      const previousGroupDetails =
        queryClient.getQueryData<GroupDetailsResponse>(["groupDetails", slug]);

      queryClient.setQueryData<GroupDetailsResponse>(
        ["groupDetails", slug],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              meta: {
                ...old.data.meta,
                settings: {
                  ...(old.data.meta.settings || {
                    isMuted: false,
                    isFollowing: true,
                    isPinned: false,
                  }),
                  ...settings,
                },
              },
            },
          };
        }
      );

      return { previousGroupDetails };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Settings updated successfully");
    },
    onError: (
      error: AxiosError<ApiError>,
      _variables,
      context:
        | { previousGroupDetails: GroupDetailsResponse | undefined }
        | undefined
    ) => {
      if (context?.previousGroupDetails) {
        queryClient.setQueryData(
          ["groupDetails", slug],
          context.previousGroupDetails
        );
      }
      toast.error(
        error?.response?.data?.message || "Failed to update settings"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", slug],
      });
      // Invalidate broad lists as pinning affects order/status
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
    },
  });
};

const groupHooks = {
  // Creation & Management
  useCreateGroup,
  useDeleteGroup,
  useUpdateGroupDetails,
  useUpdateGroupAvatar,
  useUpdateGroupCoverImage,

  // Queries - My Groups & Discovery
  useMyGroups,
  useUniversityGroups,
  useCareerGroups,
  useSuggestedGroups,
  useSentGroupRequests,
  useInvitedGroups,

  // Group Details & Info
  useGroupDetails,
  useGroupUnreadCounts,
  useGroupMembers,

  // Posts - Feed & Content
  useGroupPosts,
  useGroupPinnedPosts,
  useGroupMarketplacePosts,
  useCreateGroupPost,
  useCreateMarketplacePost,
  usePendingPosts,

  // Post Actions
  useToggleLikeGroupPost,
  useDeleteGroupPost,
  useUpdateGroupPost,
  useToggleReadStatusGroupPost,
  useToggleBookmarkGroupPost,
  useTogglePinGroupPost,

  // Post Moderation
  useApprovePost,
  useRejectPost,

  // Comments
  useAddGroupComment,
  useDeleteGroupComment,

  // Membership Actions
  useJoinGroup,
  useLeaveGroup,
  useCancelJoinRequest,
  useInviteMembers,
  useRemoveGroupMember,

  // Join Request Management
  useAcceptJoinRequest,
  useRejectJoinRequest,

  // Member Moderation
  useBanMember,

  // Role Management
  useAssignGroupAdmin,
  useRevokeGroupAdmin,
  usePromoteToModerator,
  usePromoteToAdmin,
  useDemoteToModerator,
  useDemoteToMember,
  useTransferOwnership,

  // Member Settings
  useUpdateMemberSettings,
} as const;

export { groupHooks };
