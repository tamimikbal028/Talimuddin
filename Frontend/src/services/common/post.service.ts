import api from "../../lib/axios";

import type { CreatePostRequest } from "../../types";

export const postService = {
  // Create Post
  createPost: async (reqData: CreatePostRequest) => {
    const response = await api.post("/posts", reqData);
    return response.data;
  },

  // Like / Unlike Post
  togglePostLike: async (postId: string) => {
    const { data } = await api.post(`/posts/${postId}/toggle-like`);
    return data;
  },

  // Delete Post
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Update Post
  updatePost: async (
    postId: string,
    data: { content: string; tags?: string[]; visibility?: string }
  ) => {
    const response = await api.patch(`/posts/${postId}`, data);
    return response.data;
  },

  // Toggle Read Status
  togglePostRead: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-read`);
    return response.data;
  },

  // Toggle Bookmark (Save Post)
  toggleBookmark: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-bookmark`);
    return response.data;
  },

  // Toggle Pin (Pin/Unpin Post)
  togglePin: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-pin`);
    return response.data;
  },
};
