import type { Gender, User } from "./user.types";

export interface ProfileMeta {
  user_relation_status: string;
  isFollowing: boolean;
  isBlockedByMe: boolean;
  isBlockedByTarget: boolean;
  isOwnProfile: boolean;
}

export interface ProfileHeaderData {
  user: User;
  meta: ProfileMeta;
}

export interface UpdateGeneralData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
}
