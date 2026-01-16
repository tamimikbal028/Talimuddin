import { useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "../../services/friendship.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types";

// Helper to invalidate all friendship-related queries
const invalidateAllFriendshipQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  // Profile related
  queryClient.invalidateQueries({ queryKey: ["profileHeader"] });

  // Friend page related
  queryClient.invalidateQueries({ queryKey: ["friends"] });
  queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
  queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
  queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });

  // Group members - all groups (marks stale, fetches only when active)
  queryClient.invalidateQueries({ queryKey: ["groupMembers"] });

  // Room members - all rooms (marks stale, fetches only when active)
  queryClient.invalidateQueries({ queryKey: ["roomMembers"] });
};

// 1. Send Friend Request
const useSendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.sendRequest(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 2. Accept Friend Request
const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.acceptRequest(requesterId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 3. Reject Friend Request
const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requesterId }: { requesterId: string }) =>
      friendService.rejectRequest(requesterId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 4. Cancel Sent Request
const useCancelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId }: { recipientId: string }) =>
      friendService.cancelRequest(recipientId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 5. Unfriend User
const useUnfriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ friendId }: { friendId: string }) =>
      friendService.unfriend(friendId),
    onSuccess: (response) => {
      toast.info(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 6. Block User
const useBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => friendService.block(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// 7. Unblock User
const useUnblock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      friendService.unblock(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      invalidateAllFriendshipQueries(queryClient);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

const commonFriendshipHooks = {
  useSendRequest,
  useAcceptRequest,
  useRejectRequest,
  useCancelRequest,
  useUnfriend,
  useBlock,
  useUnblock,
} as const;

export { commonFriendshipHooks };
