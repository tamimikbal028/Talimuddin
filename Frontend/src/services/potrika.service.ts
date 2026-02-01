import type { ApiResponse, Potrika, ProfilePostsResponse } from "../types";
import api from "../lib/axios";

export const potrikaService = {
  getPotrikaHeader: async (
    potrikaId: string
  ): Promise<ApiResponse<{ potrika: Potrika }>> => {
    const response = await api.get<ApiResponse<{ potrika: Potrika }>>(
      `/potrika/${potrikaId}`
    );
    return response.data;
  },

  getPotrikaPosts: async (
    potrikaId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProfilePostsResponse> => {
    const response = await api.get<ProfilePostsResponse>(
      `/potrika/${potrikaId}/posts`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

export default potrikaService;
