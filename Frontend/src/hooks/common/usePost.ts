import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postService } from "../../services/common/post.service";
import type {
  ApiError,
  CreatePostRequest,
  ProfilePostsResponse,
} from "../../types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { POST_STATUS } from "../../constants/post";

interface UsePostMutationProps {
  queryKey?: (string | undefined)[] | (string | undefined)[][]; // Single key or Array of keys
  invalidateKey?: (string | undefined)[] | (string | undefined)[][];
}

const useCreatePost = ({ queryKey, invalidateKey }: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: (response) => {
      // 1. যদি কোনো লিস্ট থাকে, সেখানে ম্যানুয়ালি শুরুতে নতুন পোস্ট অ্যাড করা (Optional)
      if (queryKey) {
        queryClient.setQueriesData(
          { queryKey: queryKey },
          (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
            if (!oldData || oldData.pages.length === 0) return oldData;

            const newItem = response.data; // { post, meta }
            const firstPage = oldData.pages[0];
            const updatedFirstPage = {
              ...firstPage,
              data: {
                ...firstPage.data,
                posts: [newItem, ...firstPage.data.posts],
              },
            };

            return {
              ...oldData,
              pages: [updatedFirstPage, ...oldData.pages.slice(1)],
            };
          }
        );
      }

      // 2. অন্যান্য রিলেটেড ডেটা সিঙ্ক করা
      if (invalidateKey) {
        // invalidateKey যদি অ্যারে অফ অ্যারে হয় (multiple keys)
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: invalidateKey });
        }
      }

      if (response.data?.post?.status === POST_STATUS.PENDING) {
        toast.info("Post submitted and waiting for admin approval");
      } else {
        toast.success(response.message);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message || "Create post failed");
    },
  });
};

const useToggleLikePost = ({
  queryKey,
  invalidateKey,
}: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      postService.togglePostLike(postId),

    // ১. ক্লিক করার সাথে সাথে রান হবে (Optimistic Update)
    onMutate: async ({ postId }: { postId: string }) => {
      // ব্যাকগ্রাউন্ড ফেচ আটকানো (Safety)
      await queryClient.cancelQueries({ queryKey: queryKey }); // Dynamic Key

      // আগের ডেটার স্ন্যাপশট নেওয়া (Rollback এর জন্য)
      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey, // Dynamic Key
      });

      // মেমোরিতে ডেটা ম্যানুয়ালি আপডেট করা
      queryClient.setQueriesData(
        { queryKey: queryKey }, // Dynamic Key
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    const isLiked = item.meta.isLiked;
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isLiked: !isLiked,
                      },
                      post: {
                        ...item.post,
                        likesCount:
                          (isLiked ? -1 : 1) + (item.post.likesCount || 0),
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      // স্ন্যাপশট রিটার্ন করা
      return { previousPosts };
    },

    onError: (error: AxiosError<ApiError>, variables, context) => {
      // আগের অবস্থায় ফিরিয়ে নেওয়া (Rollback)
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { postId } = variables;
      console.error(`Error toggling like for post ${postId}:`, error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleLikePost");
    },
    onSettled: () => {
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
      }
    },
  });
};

const useToggleReadStatus = ({
  queryKey,
  invalidateKey,
}: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  // Helper to check if queryKey is array of arrays
  const isMultipleKeys = queryKey && Array.isArray(queryKey[0]);

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      postService.togglePostRead(postId),

    // Optimistic Update
    onMutate: async ({ postId }: { postId: string }) => {
      const keys = isMultipleKeys
        ? (queryKey as (string | undefined)[][])
        : [queryKey as (string | undefined)[]];

      // Cancel all queries
      await Promise.all(
        keys.map((key) => queryClient.cancelQueries({ queryKey: key }))
      );

      // Get previous data from all queries
      const previousPosts = keys.flatMap((key) =>
        queryClient.getQueriesData({ queryKey: key })
      );

      // Update all queries optimistically
      keys.forEach((key) => {
        queryClient.setQueriesData(
          { queryKey: key },
          (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
            if (!oldData || !oldData.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (!page?.data?.posts) return page;

                return {
                  ...page,
                  data: {
                    ...page.data,
                    posts: page.data.posts.map((item) => {
                      if (item.post._id === postId) {
                        return {
                          ...item,
                          meta: {
                            ...item.meta,
                            isRead: !item.meta.isRead,
                          },
                        };
                      }
                      return item;
                    }),
                  },
                };
              }),
            };
          }
        );
      });

      return { previousPosts };
    },

    onError: (error: AxiosError<ApiError>, variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { postId } = variables;
      console.error(`Error toggling read status for post ${postId}:`, error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleReadStatus");
    },

    onSettled: () => {
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
      }
    },
  });
};

const useToggleBookmark = ({
  queryKey,
  invalidateKey,
}: UsePostMutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      postService.toggleBookmark(postId),

    // Optimistic Update
    onMutate: async ({ postId }: { postId: string }) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey,
      });

      queryClient.setQueriesData(
        { queryKey: queryKey },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isSaved: !item.meta.isSaved,
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousPosts };
    },

    onSuccess: () => {
      // Invalidate related queries
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          invalidateKey.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key as string[] });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as string[],
          });
        }
      }
    },

    onError: (error: AxiosError<ApiError>, variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { postId } = variables;
      console.error(`Error toggling bookmark for post ${postId}:`, error);
    },
  });
};

const useUpdatePost = ({ queryKey, invalidateKey }: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: string;
      data: { content: string; tags?: string[]; visibility?: string };
    }) => {
      return postService.updatePost(postId, data);
    },

    onSuccess: (data) => {
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: queryKey },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) =>
                  item.post._id === data.data.post._id ? data.data : item
                ),
              },
            })),
          };
        }
      );

      // Invalidate additional queries if specified (e.g., pinned posts)
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
      }

      toast.success(data.message || data.data?.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Update post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useUpdatePost");
    },
  });
};

const useDeletePost = ({ queryKey, invalidateKey }: UsePostMutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      postService.deletePost(postId),

    onSuccess: (response, variables) => {
      const { postId } = variables;
      // 1. Dynamic Posts List থেকে পোস্টটি রিমুভ করা
      if (queryKey) {
        queryClient.setQueriesData(
          { queryKey: queryKey },
          (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.filter(
                    (item) => item.post._id !== postId
                  ),
                },
              })),
            };
          }
        );
      }

      // 2. Dynamic Header Invalidate করা (যদি Key থাকে)
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
      }

      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Delete post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useDeletePost");
    },
  });
};

const useTogglePin = ({ queryKey, invalidateKey }: UsePostMutationProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      postService.togglePin(postId),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey,
      });

      queryClient.setQueriesData(
        { queryKey: queryKey },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    return {
                      ...item,
                      post: {
                        ...item.post,
                        isPinned: !item.post.isPinned,
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousPosts };
    },

    onSuccess: (response) => {
      // Invalidate related queries (e.g., pinnedPosts, groupDetails)
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: invalidateKey });
        }
      }
      toast.success(response.message);
    },

    onError: (error: AxiosError<ApiError>, variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { postId } = variables;
      console.error(`Error toggling pin for post ${postId}:`, error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useTogglePin");
    },
  });
};

const postHooks = {
  useCreatePost,
  useToggleLikePost,
  useToggleReadStatus,
  useToggleBookmark,
  useUpdatePost,
  useDeletePost,
  useTogglePin,
} as const;

export { postHooks };
