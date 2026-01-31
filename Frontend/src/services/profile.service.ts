// Axios Instance
import { POST_LIMIT } from "../constants";
import api from "../lib/axios";

// Types
import type {
  User,
  ApiResponse,
  UpdateGeneralData,
  ProfileHeaderData,
} from "../types";

export const profileService = {
  // Get Profile by Username
  getProfileHeader: async (
    username: string
  ): Promise<ApiResponse<ProfileHeaderData>> => {
    const response = await api.get<ApiResponse<ProfileHeaderData>>(
      `/profile/${username}`
    );
    return response.data;
  },

  // Get Profile Details by Username
  getProfileDetails: async (
    username: string
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>(
      `/profile/details/${username}`
    );
    return response.data;
  },

  // Update General Info
  updateGeneral: async (
    data: UpdateGeneralData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      "/profile/update-general",
      data
    );
    return response.data;
  },

  // Update Avatar Image
  updateAvatar: async (
    formData: FormData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      "/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Update Cover Image
  updateCoverImage: async (
    formData: FormData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      "/profile/cover-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get Profile Posts
  getProfilePosts: async (username: string, page: number) => {
    const response = await api.get(`/profile/${username}/posts`, {
      params: { page, limit: POST_LIMIT },
    });
    return response.data;
  },
};

export default profileService;
