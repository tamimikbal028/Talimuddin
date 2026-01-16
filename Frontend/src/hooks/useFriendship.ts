import { useInfiniteQuery } from "@tanstack/react-query";
import { friendService } from "../services/friendship.service";
import { commonFriendshipHooks } from "./common/useFriendship";

// ====================================
// Friendship Actions Hooks (using common hooks)
// ====================================

// 1. Send Friend Request
const useSendFriendRequest = () => {
  return commonFriendshipHooks.useSendRequest();
};

// 2. Accept Friend Request
const useAcceptFriendRequest = () => {
  return commonFriendshipHooks.useAcceptRequest();
};

// 3. Reject Friend Request
const useRejectFriendRequest = () => {
  return commonFriendshipHooks.useRejectRequest();
};

// 4. Cancel Sent Request
const useCancelFriendRequest = () => {
  return commonFriendshipHooks.useCancelRequest();
};

// 5. Unfriend User
const useUnfriendUser = () => {
  return commonFriendshipHooks.useUnfriend();
};

// 6. Block User
const useBlockUser = () => {
  return commonFriendshipHooks.useBlock();
};

// 7. Unblock User
const useUnblockUser = () => {
  return commonFriendshipHooks.useUnblock();
};

// ====================================
// Friend Page Hooks
// ====================================

// 8. Get Friends List Hook
const useFriendsList = () => {
  return useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: ({ pageParam }) =>
      friendService.getFriendsList(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 9. Get Received Requests Hook
const useReceivedRequests = () => {
  return useInfiniteQuery({
    queryKey: ["friendRequests"],
    queryFn: ({ pageParam }) =>
      friendService.getReceivedRequests(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 10. Get Sent Requests Hook
const useSentRequests = () => {
  return useInfiniteQuery({
    queryKey: ["sentRequests"],
    queryFn: ({ pageParam }) =>
      friendService.getSentRequests(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

// 11. Get Suggestions Hook
const useFriendSuggestions = () => {
  return useInfiniteQuery({
    queryKey: ["friendSuggestions"],
    queryFn: ({ pageParam }) =>
      friendService.getSuggestions(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

const friendshipHooks = {
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useCancelFriendRequest,
  useUnfriendUser,
  useBlockUser,
  useUnblockUser,
  useFriendsList,
  useReceivedRequests,
  useSentRequests,
  useFriendSuggestions,
} as const;

export { friendshipHooks };
