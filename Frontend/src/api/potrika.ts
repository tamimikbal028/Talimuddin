import type { AxiosResponse } from "axios";
import type { Attachment, Post } from "../types";
import api from "../lib/axios";

interface PotrikaHeaderResponse {
  potrika: {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
    coverImage?: string;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
  };
  meta: {
    postsCount: number;
  };
}

interface PotrikaPostsResponse {
  posts: Array<{
    post: Post;
    meta: {
      isLiked: boolean;
      isSaved: boolean;
      isMine: boolean;
      isRead: boolean;
    };
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CreatePotrikaPostData {
  content: string;
  visibility: "PUBLIC" | "CONNECTIONS" | "ONLY_ME";
  postOnId: string;
  postOnModel: string;
  attachments: Attachment[];
  tags: string[];
}

// Get potrika header
export const getPotrikaHeader = (
  potrikaId: string
): Promise<AxiosResponse<{ data: PotrikaHeaderResponse }>> => {
  return api.get(`/potrika/${potrikaId}`);
};

// Get potrika posts
export const getPotrikaPosts = (
  potrikaId: string,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<{ data: PotrikaPostsResponse }>> => {
  return api.get(`/potrika/${potrikaId}/posts`, {
    params: { page, limit },
  });
};

// Create post on potrika
export const createPotrikaPost = (
  data: CreatePotrikaPostData
): Promise<AxiosResponse> => {
  return api.post("/posts/create", data);
};

export default {
  getPotrikaHeader,
  getPotrikaPosts,
  createPotrikaPost,
};
