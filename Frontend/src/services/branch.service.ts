import api from "../lib/axios";
import { BRANCH_LIMIT, MEMBERS_LIMIT, POST_LIMIT } from "../constants";
import type {
  CreateBranchResponse,
  MyBranchesResponse,
  BranchDetailsResponse,
  JoinBranchResponse,
  DeleteBranchResponse,
  UpdateBranchResponse,
  UpdateBranchData,
  BranchPostsResponse,
  BranchMembersResponse,
  BaseBranchActionResponse,
  BranchPendingRequestsResponse,
} from "../types";

export const branchService = {
  // Create Branch (owner only)
  createBranch: async (branchData: {
    name: string;
    description?: string;
    branchType: string;
    parentBranchJoinCode?: string;
  }): Promise<CreateBranchResponse> => {
    const response = await api.post<CreateBranchResponse>(
      "/branches",
      branchData
    );
    return response.data;
  },
  // Get My Branches
  getMyBranches: async (page: number): Promise<MyBranchesResponse> => {
    const limit = BRANCH_LIMIT; // Using branch limit constant
    const response = await api.get<MyBranchesResponse>("/branches/myBranches", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get All Branches
  getAllBranches: async (page: number): Promise<MyBranchesResponse> => {
    const limit = BRANCH_LIMIT;
    const response = await api.get<MyBranchesResponse>(
      "/branches/allBranches",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Branch Details
  getBranchDetails: async (
    branchId: string
  ): Promise<BranchDetailsResponse> => {
    const response = await api.get<BranchDetailsResponse>(
      `/branches/${branchId}`
    );
    return response.data;
  },

  // Join Branch (by join code only)
  joinBranch: async (joinCode: string): Promise<JoinBranchResponse> => {
    const response = await api.post<JoinBranchResponse>("/branches/join", {
      joinCode,
    });
    return response.data;
  },

  // Delete Branch (Creator only)
  deleteBranch: async (branchId: string): Promise<DeleteBranchResponse> => {
    const response = await api.delete<DeleteBranchResponse>(
      `/branches/${branchId}`
    );
    return response.data;
  },

  // Update Branch (Creator or Admin)
  updateBranch: async (
    branchId: string,
    updateData: UpdateBranchData
  ): Promise<UpdateBranchResponse> => {
    const response = await api.patch<UpdateBranchResponse>(
      `/branches/${branchId}`,
      updateData
    );
    return response.data;
  },

  // Update Branch Cover Image (Creator or Admin)
  updateBranchCoverImage: async (
    branchId: string,
    coverImage: File
  ): Promise<UpdateBranchResponse> => {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch<UpdateBranchResponse>(
      `/branches/${branchId}/cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get Branch Posts
  getBranchPosts: async (
    branchId: string,
    page: number
  ): Promise<BranchPostsResponse> => {
    const limit = POST_LIMIT;
    const response = await api.get<BranchPostsResponse>(
      `/branches/${branchId}/posts`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Branch Members
  getBranchMembers: async (
    branchId: string,
    page: number
  ): Promise<BranchMembersResponse> => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get<BranchMembersResponse>(
      `/branches/${branchId}/members`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Leave Branch (Member or Admin, not Creator)
  leaveBranch: async (branchId: string): Promise<BaseBranchActionResponse> => {
    const response = await api.delete<BaseBranchActionResponse>(
      `/branches/${branchId}/leave`
    );
    return response.data;
  },

  // Remove Member (Creator or Admin)
  removeMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.delete<BaseBranchActionResponse>(
      `/branches/${branchId}/remove/${userId}`
    );
    return response.data;
  },

  // Promote Member to Admin (Creator only)
  promoteMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.patch<BaseBranchActionResponse>(
      `/branches/${branchId}/promote/${userId}`
    );
    return response.data;
  },

  // Demote Admin to Member (Creator only)
  demoteMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.patch<BaseBranchActionResponse>(
      `/branches/${branchId}/demote/${userId}`
    );
    return response.data;
  },

  // Get Pending Join Requests (Admin only)
  getPendingRequests: async (
    branchId: string
  ): Promise<BranchPendingRequestsResponse> => {
    const response = await api.get<BranchPendingRequestsResponse>(
      `/branches/${branchId}/pending-requests`
    );
    return response.data;
  },

  // Approve Join Request (Admin only)
  approveJoinRequest: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.post<BaseBranchActionResponse>(
      `/branches/${branchId}/approve/${userId}`
    );
    return response.data;
  },

  // Reject Join Request (Admin only)
  rejectJoinRequest: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.post<BaseBranchActionResponse>(
      `/branches/${branchId}/reject/${userId}`
    );
    return response.data;
  },
};
