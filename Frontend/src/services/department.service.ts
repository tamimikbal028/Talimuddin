import api from "../lib/axios";
import { POST_LIMIT } from "../constants";
import type {
  Department,
  ApiResponse,
  DepartmentFeedResponse,
  DepartmentMeta,
} from "../types";

export const departmentService = {
  // Get Department Header (Minimal data)
  getDepartmentHeader: async (
    deptId: string
  ): Promise<ApiResponse<{ department: Department; meta: DepartmentMeta }>> => {
    const response = await api.get<
      ApiResponse<{ department: Department; meta: DepartmentMeta }>
    >(`/departments/${deptId}/header`);
    return response.data;
  },

  // Get Department Details (Full data)
  getDepartmentDetails: async (
    deptId: string
  ): Promise<ApiResponse<{ department: Department }>> => {
    const response = await api.get<ApiResponse<{ department: Department }>>(
      `/departments/${deptId}/details`
    );
    return response.data;
  },

  // Get Department Feed (Official)
  getDepartmentFeed: async (
    deptId: string,
    page: number = 1
  ): Promise<ApiResponse<DepartmentFeedResponse>> => {
    const limit = POST_LIMIT;
    const response = await api.get<ApiResponse<DepartmentFeedResponse>>(
      `/departments/${deptId}/feed`,
      { params: { page, limit } }
    );
    return response.data;
  },

  // Search Departments
  searchDepartments: async (
    query: string,
    instId?: string
  ): Promise<ApiResponse<{ departments: Department[] }>> => {
    const response = await api.get<ApiResponse<{ departments: Department[] }>>(
      "/departments/search",
      {
        params: { q: query, instId },
      }
    );
    return response.data;
  },
};

export default departmentService;
