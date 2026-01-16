import type { User } from "./user.types";
import type { Pagination } from "./common.types";
import { ROOM_TYPES, ROOM_ROLES } from "../constants/room";

export interface Room {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  roomType: (typeof ROOM_TYPES)[keyof typeof ROOM_TYPES];
  joinCode: string;
  isDeleted: boolean;
  membersCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyRoomsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    rooms: RoomListItem[];
    pagination: Pagination;
  };
}

export interface RoomListItem {
  _id: string;
  name: string;
  coverImage: string;
}

// Room Member (from getRoomMembers)
export interface RoomMember {
  user: User;
  meta: {
    memberId: string;
    role: (typeof ROOM_ROLES)[keyof typeof ROOM_ROLES];
    isSelf: boolean;
    isAdmin: boolean;
    joinedAt: string;
    canManage: boolean;
  };
}

// Update Room Data (for updateRoom API)
export interface UpdateRoomData {
  name: string;
  description?: string;
  roomType: string;
}

// Room Request (from getRoomPendingRequests)
export interface RoomRequest {
  user: User;
  meta: {
    memberId: string;
    requestedAt: string;
  };
}

export interface RoomDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    room: Room;
    meta: RoomDetailsMeta;
  };
}

export interface RoomDetailsMeta {
  isMember: boolean;
  isRoomAdmin: boolean;
  isAppOwner: boolean;
  isAppAdmin: boolean;
}

export interface CreateRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

export interface JoinRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
    roomName: string;
    isPending: boolean;
  };
}

export interface ToggleArchiveRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
    isArchived: boolean;
  };
}

export interface HideRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
    isHidden: boolean;
  };
}

export interface DeleteRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
  };
}

export interface UpdateRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    room: Room;
  };
}

// Import PostResponseItem for room posts
import type { PostResponseItem } from "./post.types";

export interface RoomPostsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    posts: PostResponseItem[];
    pagination: Pagination;
  };
}

export interface RoomMembersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    members: RoomMember[];
    pagination: Pagination;
    meta: {
      currentUserRole: (typeof ROOM_ROLES)[keyof typeof ROOM_ROLES];
    };
  };
}

export interface BaseRoomActionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
  };
}

export interface RoomPendingRequestsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    requests: RoomRequest[];
    pagination: Pagination;
  };
}
