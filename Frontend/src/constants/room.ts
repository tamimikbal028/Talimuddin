export const ROOM_TYPES = {
  MAIN_ROOM: "MAIN_ROOM",
  SUB_ROOM: "SUB_ROOM",
} as const;

export const ROOM_ROLES = {
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export const ROOM_PRIVACY = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  CLOSED: "CLOSED",
} as const;

export const ROOM_MEMBERSHIP_STATUS = {
  JOINED: "JOINED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  BANNED: "BANNED",
} as const;
