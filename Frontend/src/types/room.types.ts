import type { User } from "./user.types";
import type { Pagination } from "./common.types";

// Room Types
export type RoomType = "MAIN_BRANCH" | "SUB_BRANCH";

// Room Settings
export interface RoomSettings {
  allowStudentPosting: boolean;
  allowComments: boolean;
}

// Room (full object from backend)
export interface Room {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  roomType: RoomType;
  joinCode: string;
  creator: User;
  membersCount: number;
  postsCount: number;
  isDeleted: boolean;
  settings: RoomSettings;
  createdAt: string;
  updatedAt: string;
}

// Room in list (getMyRooms response)
export interface RoomListItem {
  _id: string;
  name: string;
  coverImage: string;
}

// Room Meta (from getRoomDetails)
export interface RoomMeta {
  isMember: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  joinCode: string | null;
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
    roomId: string;
    roomName: string;
  };
}

export interface JoinRoomResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roomId: string;
    roomName: string;
  };
}
