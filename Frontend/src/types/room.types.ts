import type { User } from "./user.types";
import type { Pagination } from "./common.types";

// Room Types
export type RoomType =
  | "UNIVERSITY"
  | "COLLEGE"
  | "COACHING"
  | "SCHOOL"
  | "GENERAL";

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
  isArchived: boolean;
  isDeleted: boolean;
  settings: RoomSettings;
  createdAt: string;
  updatedAt: string;
}

// Room in list (getMyRooms response) - includes isCR from membership
export interface RoomListItem {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  roomType: RoomType;
  creator: User;
  membersCount: number;
  postsCount: number;
  joinCode: string;
  isCR: boolean; // From membership
  isArchived: boolean;
  createdAt: string;
}

// Room Meta (from getRoomDetails)
export interface RoomMeta {
  isMember: boolean;
  isTeacher: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isCR: boolean;
  isHidden: boolean;
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
    room: Room;
    meta: {
      isMember: boolean;
      isCreator: boolean;
      joinCode: string;
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
  };
}
