import type { User } from "./user.types";
import type { Pagination } from "./common.types";
import { ROOM_TYPES, ROOM_PRIVACY, ROOM_ROLES } from "../constants/room";

// Room (full object from backend)
export interface Room {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  roomType: (typeof ROOM_TYPES)[keyof typeof ROOM_TYPES];
  privacy: (typeof ROOM_PRIVACY)[keyof typeof ROOM_PRIVACY];
  joinCode: string;
  creator: User;
  membersCount: number;
  postsCount: number;
  isArchived: boolean;
  isDeleted: boolean;
  settings: {
    allowStudentPosting: boolean;
    allowComments: boolean;
    requirePostApproval: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Room in list (getMyRooms response) - minimal fields for card display
export interface RoomListItem {
  _id: string;
  name: string;
  coverImage: string;
  creator: {
    fullName: string;
    userName: string;
  };
}

// Room Meta (from getRoomDetails)
export interface RoomMeta {
  isMember: boolean;
  hasPendingRequest: boolean;
  isRejected: boolean;
  isBanned: boolean;
  isTeacher: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isCR: boolean;
  isHidden: boolean;
  canPost: boolean;
  canComment: boolean;
  pendingRequestsCount: number;
  pendingPostsCount: number;
  joinCode: string;
}

// Room Member (from getRoomMembers)
export interface RoomMember {
  user: User;
  meta: {
    memberId: string;
    role: (typeof ROOM_ROLES)[keyof typeof ROOM_ROLES];
    isSelf: boolean;
    isCR: boolean;
    isAdmin: boolean;
    isCreator: boolean;
    joinedAt: string;
    user_relation_status: string;
    canManage: boolean;
  };
}

// Update Room Data (for updateRoom API)
export interface UpdateRoomData {
  name: string;
  description?: string;
  roomType: string;
  privacy: string;
  settings: {
    allowStudentPosting: boolean;
    allowComments: boolean;
    requirePostApproval: boolean;
  };
}

// Room Request (from getRoomPendingRequests)
export interface RoomRequest {
  user: User;
  meta: {
    memberId: string;
    requestedAt: string;
  };
}

// API Response Types
export interface RoomDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    room: Room;
    meta: RoomMeta;
  };
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

export interface CreateRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    room: Room;
    meta: {
      isMember: boolean;
      isCreator: boolean;
      isAdmin: boolean;
    };
  };
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
