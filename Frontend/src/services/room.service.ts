import api from "../lib/axios";
import { ROOM_LIMIT, MEMBERS_LIMIT, POST_LIMIT } from "../constants";
import type {
  CreateRoomResponse,
  MyRoomsResponse,
  RoomDetailsResponse,
  JoinRoomResponse,
  ToggleArchiveRoomResponse,
  HideRoomResponse,
  DeleteRoomResponse,
  UpdateRoomResponse,
  UpdateRoomData,
  RoomPostsResponse,
  RoomMembersResponse,
  BaseRoomActionResponse,
  RoomPendingRequestsResponse,
} from "../types";

export const roomService = {
  // Create Room (Teachers only)
  createRoom: async (roomData: {
    name: string;
    description?: string;
    roomType: string;
    allowStudentPosting: boolean;
    allowComments: boolean;
  }): Promise<CreateRoomResponse> => {
    const response = await api.post<CreateRoomResponse>("/rooms", roomData);
    return response.data;
  },

  // Get My Rooms
  getMyRooms: async (page: number): Promise<MyRoomsResponse> => {
    const limit = ROOM_LIMIT;
    const response = await api.get<MyRoomsResponse>("/rooms/myRooms", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Room Details
  getRoomDetails: async (roomId: string): Promise<RoomDetailsResponse> => {
    const response = await api.get<RoomDetailsResponse>(`/rooms/${roomId}`);
    return response.data;
  },

  // Join Room (by join code only)
  joinRoom: async (joinCode: string): Promise<JoinRoomResponse> => {
    const response = await api.post<JoinRoomResponse>("/rooms/join", {
      joinCode,
    });
    return response.data;
  },

  // Toggle Archive Room (Creator only)
  toggleArchiveRoom: async (
    roomId: string
  ): Promise<ToggleArchiveRoomResponse> => {
    const response = await api.patch<ToggleArchiveRoomResponse>(
      `/rooms/${roomId}/archive`
    );
    return response.data;
  },

  // Delete Room (Creator only)
  deleteRoom: async (roomId: string): Promise<DeleteRoomResponse> => {
    const response = await api.delete<DeleteRoomResponse>(`/rooms/${roomId}`);
    return response.data;
  },

  // Hide Room (Member only)
  hideRoom: async (roomId: string): Promise<HideRoomResponse> => {
    const response = await api.patch<HideRoomResponse>(`/rooms/${roomId}/hide`);
    return response.data;
  },

  // Update Room (Creator or Admin)
  updateRoom: async (
    roomId: string,
    updateData: UpdateRoomData
  ): Promise<UpdateRoomResponse> => {
    const response = await api.patch<UpdateRoomResponse>(
      `/rooms/${roomId}`,
      updateData
    );
    return response.data;
  },

  // Update Room Cover Image (Creator or Admin)
  updateRoomCoverImage: async (
    roomId: string,
    coverImage: File
  ): Promise<UpdateRoomResponse> => {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch<UpdateRoomResponse>(
      `/rooms/${roomId}/cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get Room Posts
  getRoomPosts: async (
    roomId: string,
    page: number
  ): Promise<RoomPostsResponse> => {
    const limit = POST_LIMIT;
    const response = await api.get<RoomPostsResponse>(
      `/rooms/${roomId}/posts`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Room Members
  getRoomMembers: async (
    roomId: string,
    page: number
  ): Promise<RoomMembersResponse> => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get<RoomMembersResponse>(
      `/rooms/${roomId}/members`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Leave Room (Member or Admin, not Creator)
  leaveRoom: async (roomId: string): Promise<BaseRoomActionResponse> => {
    const response = await api.delete<BaseRoomActionResponse>(
      `/rooms/${roomId}/leave`
    );
    return response.data;
  },

  // Cancel Join Request
  cancelJoinRequest: async (
    roomId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.delete<BaseRoomActionResponse>(
      `/rooms/${roomId}/cancel-request`
    );
    return response.data;
  },

  // Accept Join Request (Creator or Admin)
  acceptJoinRequest: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.patch<BaseRoomActionResponse>(
      `/rooms/${roomId}/accept/${userId}`
    );
    return response.data;
  },

  // Reject Join Request (Creator or Admin)
  rejectJoinRequest: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.patch<BaseRoomActionResponse>(
      `/rooms/${roomId}/reject/${userId}`
    );
    return response.data;
  },

  // Ban Member (Creator or Admin)
  banMember: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.patch<BaseRoomActionResponse>(
      `/rooms/${roomId}/ban/${userId}`
    );
    return response.data;
  },

  // Remove Member (Creator or Admin)
  removeMember: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.delete<BaseRoomActionResponse>(
      `/rooms/${roomId}/remove/${userId}`
    );
    return response.data;
  },

  // Promote Member to Admin (Creator only)
  promoteMember: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.patch<BaseRoomActionResponse>(
      `/rooms/${roomId}/promote/${userId}`
    );
    return response.data;
  },

  // Demote Admin to Member (Creator only)
  demoteMember: async (
    roomId: string,
    userId: string
  ): Promise<BaseRoomActionResponse> => {
    const response = await api.patch<BaseRoomActionResponse>(
      `/rooms/${roomId}/demote/${userId}`
    );
    return response.data;
  },

  // Get Room Pending Requests (Creator or Admin)
  getRoomPendingRequests: async (
    roomId: string,
    page: number
  ): Promise<RoomPendingRequestsResponse> => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get<RoomPendingRequestsResponse>(
      `/rooms/${roomId}/requests`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Room Pending Posts
  getRoomPendingPosts: async (
    roomId: string,
    page: number
  ): Promise<RoomPostsResponse> => {
    const limit = POST_LIMIT;
    const response = await api.get<RoomPostsResponse>(
      `/rooms/${roomId}/pending-posts`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Approve Room Post
  approveRoomPost: async (
    roomId: string,
    postId: string
  ): Promise<{ status: string }> => {
    const response = await api.patch<{ status: string }>(
      `/rooms/${roomId}/posts/${postId}/approve`
    );
    return response.data;
  },

  // Reject Room Post
  rejectRoomPost: async (
    roomId: string,
    postId: string
  ): Promise<{ status: string }> => {
    const response = await api.patch<{ status: string }>(
      `/rooms/${roomId}/posts/${postId}/reject`
    );
    return response.data;
  },
};
