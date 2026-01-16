import api from "../lib/axios";
import type {
  ApiResponse,
  SendFriendRequestData,
  AcceptFriendRequestData,
  RejectFriendRequestData,
  CancelFriendRequestData,
  UnfriendData,
  BlockData,
  UnblockData,
  FriendshipListData,
} from "../types";
import { FRIENDS_LIMIT } from "../constants/pagination";

export const friendService = {
  // ====================================
  // Friendship Actions API Endpoints
  // ====================================

  // 1. Send Friend Request
  sendRequest: async (
    userId: string
  ): Promise<ApiResponse<SendFriendRequestData>> => {
    const response = await api.post(`/friendships/request/send/${userId}`);
    return response.data;
  },

  // 2. Accept Friend Request
  acceptRequest: async (
    requesterId: string
  ): Promise<ApiResponse<AcceptFriendRequestData>> => {
    const response = await api.patch(
      `/friendships/request/accept/${requesterId}`
    );
    return response.data;
  },

  // 3. Reject Friend Request
  rejectRequest: async (
    requesterId: string
  ): Promise<ApiResponse<RejectFriendRequestData>> => {
    const response = await api.delete(
      `/friendships/request/reject/${requesterId}`
    );
    return response.data;
  },

  // 4. Cancel Sent Request
  cancelRequest: async (
    recipientId: string
  ): Promise<ApiResponse<CancelFriendRequestData>> => {
    const response = await api.delete(
      `/friendships/request/cancel/${recipientId}`
    );
    return response.data;
  },

  // 5. Unfriend User
  unfriend: async (friendId: string): Promise<ApiResponse<UnfriendData>> => {
    const response = await api.delete(`/friendships/unfriend/${friendId}`);
    return response.data;
  },

  // 6. Block User
  block: async (userId: string): Promise<ApiResponse<BlockData>> => {
    const response = await api.post(`/friendships/block/${userId}`);
    return response.data;
  },

  // 7. Unblock User
  unblock: async (userId: string): Promise<ApiResponse<UnblockData>> => {
    const response = await api.delete(`/friendships/unblock/${userId}`);
    return response.data;
  },

  // ====================================
  // Friend Page API Endpoints
  // ====================================

  // 8. Get Friends List
  getFriendsList: async (
    page = 1
  ): Promise<ApiResponse<FriendshipListData>> => {
    const response = await api.get("/friendships/list", {
      params: { page, limit: FRIENDS_LIMIT },
    });
    return response.data;
  },

  // 9. Get Received Requests
  getReceivedRequests: async (
    page = 1
  ): Promise<ApiResponse<FriendshipListData>> => {
    const response = await api.get("/friendships/requests/received", {
      params: { page, limit: FRIENDS_LIMIT },
    });
    return response.data;
  },

  // 10. Get Sent Requests
  getSentRequests: async (
    page = 1
  ): Promise<ApiResponse<FriendshipListData>> => {
    const response = await api.get("/friendships/requests/sent", {
      params: { page, limit: FRIENDS_LIMIT },
    });
    return response.data;
  },

  // 11. Get Suggestions
  getSuggestions: async (
    page = 1
  ): Promise<ApiResponse<FriendshipListData>> => {
    const response = await api.get("/friendships/suggestions", {
      params: { page, limit: FRIENDS_LIMIT },
    });
    return response.data;
  },
};
