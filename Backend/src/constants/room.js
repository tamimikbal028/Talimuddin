export const ROOM_ROLES = {
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const ROOM_TYPES = {
  UNIVERSITY: "UNIVERSITY",
  COLLEGE: "COLLEGE",
  COACHING: "COACHING",
  SCHOOL: "SCHOOL",
  GENERAL: "GENERAL",
};

export const ROOM_PRIVACY = {
  PUBLIC: "PUBLIC", // Anyone can join with code
  PRIVATE: "PRIVATE", // Join request required
  CLOSED: "CLOSED", // Cannot join even with code
};

export const ROOM_MEMBERSHIP_STATUS = {
  JOINED: "JOINED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  BANNED: "BANNED",
};
