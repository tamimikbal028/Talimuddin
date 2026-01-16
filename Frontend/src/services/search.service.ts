import api from "../lib/axios";
import type { ApiResponse } from "../types/common.types";
import type {
  GlobalSearchResponse,
  SearchSuggestion,
} from "../types/search.types";

export const searchService = {
  // Global search (supports multiple categories)
  globalSearch: async (
    query: string,
    type: string = "all",
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<GlobalSearchResponse>> => {
    const response = await api.get<ApiResponse<GlobalSearchResponse>>(
      "/search/global",
      {
        params: {
          q: query,
          type,
          page,
          limit,
        },
      }
    );
    return response.data;
  },

  // Get search suggestions
  getSuggestions: async (
    query: string,
    type: string = "all"
  ): Promise<ApiResponse<{ suggestions: SearchSuggestion[] }>> => {
    const response = await api.get<
      ApiResponse<{ suggestions: SearchSuggestion[] }>
    >("/search/suggestions", {
      params: {
        q: query,
        type,
      },
    });
    return response.data;
  },
};

export default searchService;
