import type {
  ApiResponse,
  Potrika,
  ProfilePostsResponse,
  AllPotrikasResponse,
} from "../types";
import api from "../lib/axios";

export const potrikaService = {
  getAllPotrikas: async (): Promise<ApiResponse<AllPotrikasResponse>> => {
    const response =
      await api.get<ApiResponse<AllPotrikasResponse>>("/potrikas");
    return response.data;
  },

  getPotrikaHeader: async (
    potrikaId: string
  ): Promise<ApiResponse<{ potrika: Potrika }>> => {
    const response = await api.get<ApiResponse<{ potrika: Potrika }>>(
      `/potrikas/${potrikaId}`
    );
    return response.data;
  },

  getPotrikaPosts: async (
    potrikaId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProfilePostsResponse> => {
    const response = await api.get<ProfilePostsResponse>(
      `/potrikas/${potrikaId}/posts`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

export default potrikaService;
