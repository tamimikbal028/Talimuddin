import type { USER_RELATION_STATUS } from "../constants";
import type { Pagination } from "./common.types";

// ====================================
// ACTION RESPONSE DATA TYPES
// ====================================

export interface SendFriendRequestData {
  status: string;
  recipientId: string;
  friendshipId: string;
}

export interface AcceptFriendRequestData {
  status: string;
  requesterId: string;
  friendshipId: string;
}

export interface RejectFriendRequestData {
  requesterId: string;
}

export interface CancelFriendRequestData {
  recipientId: string;
}

export interface UnfriendData {
  userId: string;
}

export interface BlockData {
  blockRelation: {
    _id: string;
    requester: string;
    recipient: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UnblockData {
  userId: string;
}

// ====================================
// LIST RESPONSE DATA TYPES
// ====================================

export interface FriendshipListData {
  users: FriendshipMappedUser[];
  pagination: Pagination;
}

export interface FriendUser {
  _id: string;
  userName: string;
  fullName: string;
  avatar: string;
  institution: {
    _id: string;
    name: string;
  } | null;
}

export interface FriendshipMappedUser {
  user: FriendUser;
  meta: {
    user_relation_status: (typeof USER_RELATION_STATUS)[keyof typeof USER_RELATION_STATUS];
  };
}
