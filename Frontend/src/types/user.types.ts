// User Types - Based on Backend Response
// Constants are in src/constants/*.ts (same as Backend)

import { USER_TYPES, GENDERS, ACCOUNT_STATUS } from "../constants";

// ====================================
// ENUMS & CONSTANTS (derived from constants)
// ====================================

// App users - সবাই USER
// (ADMIN/OWNER/MODERATOR হলো internal management roles, app এ show হবে না)
export type UserType = (typeof USER_TYPES)["USER"];
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

// ====================================
// ACTIVITY RESTRICTIONS
// ====================================

export interface RestrictionDetail {
  reason?: string;
  restrictedAt?: string;
  restrictedBy?: string;
}

export interface UserRestrictions {
  isCommentBlocked: boolean;
  isPostBlocked: boolean;
  isMessageBlocked: boolean;
  commentRestriction?: RestrictionDetail;
  postRestriction?: RestrictionDetail;
  messageRestriction?: RestrictionDetail;
}

// ====================================
// USER MODEL
// ====================================

export interface User {
  _id: string;

  // Identity
  fullName: string;
  email: string;
  userName: string;
  phoneNumber?: string;

  // Profile
  avatar: string;
  coverImage: string;
  bio?: string;
  gender?: Gender;

  // Stats (from backend model)
  postsCount: number;
  connectionsCount: number;
  publicFilesCount: number;

  // Friendship
  profile_relation_status?: string;

  // User Type
  userType: UserType;

  // Status & Settings
  accountStatus: AccountStatus;
  bannedAt?: string;
  bannedBy?: string;
  bannedReason?: string;
  deletedAt?: string;
  restrictions: UserRestrictions;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
}

export interface AuthResponse {
  user: User;
}

// Login Types
export interface LoginCredentials {
  email?: string;
  userName?: string;
  password: string;
}

// Register Types
export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  userName: string;
  password: string;
  agreeToTerms: boolean;
}
