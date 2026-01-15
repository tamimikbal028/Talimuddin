// User Types - Based on Backend Response
// Constants are in src/constants/*.ts (same as Backend)

import { USER_TYPES, GENDERS, RELIGIONS, ACCOUNT_STATUS } from "../constants";

// ====================================
// ENUMS & CONSTANTS (derived from constants)
// ====================================

// App users - normal, teacher, admin, owner
export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];
export type Religion = (typeof RELIGIONS)[keyof typeof RELIGIONS];

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
  gender?: Gender;
  religion?: string;
  dateOfBirth?: string;

  // Stats (from backend model)
  postsCount: number;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  publicFilesCount: number;

  // User Type
  userType: UserType;

  // Status & Settings
  accountStatus: AccountStatus;
  bannedAt?: string;
  bannedBy?: string;
  bannedReason?: string;
  deletedAt?: string;
  restrictions: UserRestrictions;

  // Terms
  agreedToTerms: boolean;
  termsAgreedAt?: string;

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

// Login Types
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

// Register Types
export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  userName: string;
  gender: (typeof GENDERS)[keyof typeof GENDERS];
  password: string;
  agreeToTerms: boolean;
}
