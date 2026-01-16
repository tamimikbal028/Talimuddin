import { FOLLOW_TARGET_MODELS } from "../../constants";
import api from "../../lib/axios";
import type { ApiResponse } from "../../types";

export const followService = {
  // Toggle follow status (handles both follow and unfollow)
  toggleFollow: async (
    targetId: string,
    targetModel: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS]
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    const response = await api.post(`/follows/${targetId}/toggle`, {
      targetModel,
    });
    return response.data;
  },
};
