import api from "../lib/axios";
import { ROOM_LIMIT, MEMBERS_LIMIT, POST_LIMIT } from "../constants";
import type {
  CreateRoomResponse,
  MyRoomsResponse,
  RoomDetailsResponse,
  JoinRoomResponse,
} from "../types";

export const roomService = {
  // Create Room (Teachers only)
  createRoom: async (roomData: {
    name: string;
    description?: string;
    roomType: string;
    allowStudentPosting?: boolean;
    allowComments?: boolean;
  }): Promise<CreateRoomResponse> => {
    const response = await api.post<CreateRoomResponse>("/rooms", roomData);
    return response.data;
  },

  // Get All Rooms
  getAllRooms: async (page = 1): Promise<MyRoomsResponse> => {
    const limit = ROOM_LIMIT;
    const response = await api.get<MyRoomsResponse>("/rooms/all", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get My Rooms
  getMyRooms: async (page = 1): Promise<MyRoomsResponse> => {
    const limit = ROOM_LIMIT;
    const response = await api.get<MyRoomsResponse>("/rooms/my", {
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

  // Leave Room
  leaveRoom: async (roomId: string) => {
    const response = await api.post(`/rooms/${roomId}/leave`);
    return response.data;
  },

  // Delete Room (Owner only)
  deleteRoom: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },

  // Get Pending Join Requests (Owner, Admin, Teacher members)
  getPendingJoinRequests: async (roomId: string, page = 1) => {
    const response = await api.get(`/rooms/${roomId}/requests/pending`, {
      params: { page, limit: 20 },
    });
    return response.data;
  },

  // Accept Join Request
  acceptJoinRequest: async (roomId: string, requestId: string) => {
    const response = await api.post(
      `/rooms/${roomId}/requests/${requestId}/accept`
    );
    return response.data;
  },

  // Reject Join Request
  rejectJoinRequest: async (roomId: string, requestId: string) => {
    const response = await api.post(
      `/rooms/${roomId}/requests/${requestId}/reject`
    );
    return response.data;
  },

  // Update Room (Creator or Admin)
  updateRoom: async (
    roomId: string,
    updateData: {
      name?: string;
      description?: string;
      roomType?: string;
      settings?: {
        allowStudentPosting?: boolean;
        allowComments?: boolean;
      };
    }
  ) => {
    const response = await api.patch(`/rooms/${roomId}`, updateData);
    return response.data;
  },

  // Update Room Cover Image (Creator or Admin)
  updateRoomCoverImage: async (roomId: string, coverImage: File) => {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch(`/rooms/${roomId}/cover-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get Room Posts
  getRoomPosts: async (roomId: string, page = 1) => {
    const limit = POST_LIMIT;
    const response = await api.get(`/rooms/${roomId}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Room Members
  getRoomMembers: async (roomId: string, page = 1) => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get(`/rooms/${roomId}/members`, {
      params: { page, limit },
    });
    return response.data;
  },
};
