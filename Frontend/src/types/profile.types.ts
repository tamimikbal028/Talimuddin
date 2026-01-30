import type { Gender, SocialLinks, User } from "./user.types";

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

// ====================================
// UPDATE PROFILE DATA TYPES
// ====================================

/**
 * PATCH /users/update-general request body
 * Only include fields that are being updated
 */
export interface UpdateGeneralData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
  religion?: string;
  socialLinks?: SocialLinks;
  skills?: string[];
  interests?: string[];
}
