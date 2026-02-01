import type {
  PotrikaHeaderResponse,
  ApiResponse,
  ProfilePostsResponse,
} from "../types";
import api from "../lib/axios";

export const potrikaService = {
  // Get potrika header
  getPotrikaHeader: async (
    potrikaId: string
  ): Promise<ApiResponse<PotrikaHeaderResponse>> => {
    const response = await api.get<ApiResponse<PotrikaHeaderResponse>>(
      `/potrika/${potrikaId}`
    );
    return response.data;
  },

  // Get potrika posts
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
