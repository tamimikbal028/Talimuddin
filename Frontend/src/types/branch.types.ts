import type { User } from "./user.types";
import type { Pagination } from "./common.types";
import { BRANCH_TYPES, BRANCH_ROLES } from "../constants/branch";
import type { PostResponseItem } from "./post.types";

export interface Branch {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  branchType: (typeof BRANCH_TYPES)[keyof typeof BRANCH_TYPES];
  joinCode: string;
  isDeleted: boolean;
  membersCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BranchListItem {
  _id: string;
  name: string;
  coverImage: string;
}

export interface MyBranchesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branches: BranchListItem[];
    pagination: Pagination;
  };
}

// Branch Member (from getBranchMembers)
export interface BranchMember {
  user: User;
  meta: {
    memberId: string;
    role: (typeof BRANCH_ROLES)[keyof typeof BRANCH_ROLES];
    isSelf: boolean;
    isAdmin: boolean;
    joinedAt: string;
    canManage: boolean;
  };
}

// Update Branch Data (for updateBranch API)
export interface UpdateBranchData {
  name: string;
  description?: string;
  branchType: string;
}

export interface BranchDetailsMeta {
  isMember: boolean;
  isBranchAdmin: boolean;
  isAppOwner: boolean;
  isAppAdmin: boolean;
}

export interface BranchDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branch: Branch;
    meta: BranchDetailsMeta;
  };
}

export interface CreateBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

export interface JoinBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
    branchName: string;
  };
}

export interface DeleteBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
  };
}

export interface UpdateBranchResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branch: Branch;
  };
}

export interface BranchPostsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    posts: PostResponseItem[];
    pagination: Pagination;
  };
}

export interface BranchMembersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    members: BranchMember[];
    pagination: Pagination;
    meta: {
      currentUserRole: (typeof BRANCH_ROLES)[keyof typeof BRANCH_ROLES];
    };
  };
}

export interface BaseBranchActionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    branchId: string;
  };
}
