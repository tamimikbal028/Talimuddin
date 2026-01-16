export const ROOM_ROLES = {
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const ROOM_TYPES = {
  MAIN_ROOM: "MAIN_ROOM",
  SUB_ROOM: "SUB_ROOM",
};

export const ROOM_PRIVACY = {
  PUBLIC: "PUBLIC", // Anyone can join with code
  PRIVATE: "PRIVATE", // Join request required
  CLOSED: "CLOSED", // Cannot join even with code
};

export const ROOM_MEMBERSHIP_STATUS = {
  JOINED: "JOINED",
  PENDING: "PENDING",
};
