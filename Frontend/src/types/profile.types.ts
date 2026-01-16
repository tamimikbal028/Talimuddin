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

/**
 * PATCH /users/update-academic request body
 * Student fields
 */
export interface UpdateStudentAcademicData {
  institution?: string; // ObjectId - only for non-verified users
  department?: string; // ObjectId - only for non-verified users
  session?: string;
  currentSemester?: number;
  section?: string;
  studentId?: string;
}

/**
 * PATCH /users/update-academic request body
 * Teacher fields
 */
export interface UpdateTeacherAcademicData {
  institution?: string; // ObjectId - only for non-verified users
  department?: string; // ObjectId - only for non-verified users
  teacherId?: string;
  rank?: string;
  officeHours?: {
    day: string;
    timeRange: string;
    room: string;
  }[];
}

// Combined academic update type
export type UpdateAcademicData =
  | UpdateStudentAcademicData
  | UpdateTeacherAcademicData;
