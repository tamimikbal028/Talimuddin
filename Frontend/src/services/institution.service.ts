import api from "../lib/axios";
import { POST_LIMIT } from "../constants";
import type {
  Institution,
  Department,
  ApiResponse,
  InstitutionFeedResponse,
  InstitutionMeta,
} from "../types";

export const institutionService = {
  // Get Institution Header (Minimal data)
  getInstitutionHeader: async (
    instId: string
  ): Promise<
    ApiResponse<{ institution: Institution; meta: InstitutionMeta }>
  > => {
    const response = await api.get<
      ApiResponse<{ institution: Institution; meta: InstitutionMeta }>
    >(`/institutions/${instId}/header`);
    return response.data;
  },

  // Get Institution Details (Full data)
  getInstitutionDetails: async (
    instId: string
  ): Promise<ApiResponse<{ institution: Institution }>> => {
    const response = await api.get<ApiResponse<{ institution: Institution }>>(
      `/institutions/${instId}/details`
    );
    return response.data;
  },

  // Get Institution Feed (Official)
  getInstitutionFeed: async (
    instId: string,
    page: number = 1
  ): Promise<ApiResponse<InstitutionFeedResponse>> => {
    const limit = POST_LIMIT;
    const response = await api.get<ApiResponse<InstitutionFeedResponse>>(
      `/institutions/${instId}/feed`,
      { params: { page, limit } }
    );
    return response.data;
  },

  // Get Departments List
  getDepartmentsList: async (
    instId: string
  ): Promise<ApiResponse<{ departments: Department[] }>> => {
    const response = await api.get<ApiResponse<{ departments: Department[] }>>(
      `/institutions/${instId}/departments`
    );
    return response.data;
  },

  // Search Institutions
  searchInstitutions: async (
    query: string
  ): Promise<ApiResponse<{ institutions: Institution[] }>> => {
    const response = await api.get<
      ApiResponse<{ institutions: Institution[] }>
    >("/institutions/search", {
      params: { q: query },
    });
    return response.data;
  },

  // Search Departments within an institution
  searchDepartments: async (
    instId: string,
    query: string
  ): Promise<ApiResponse<{ departments: Department[] }>> => {
    const response = await api.get<ApiResponse<{ departments: Department[] }>>(
      "/depts/search",
      {
        params: { instId, q: query },
      }
    );
    return response.data;
  },
};

export default institutionService;
