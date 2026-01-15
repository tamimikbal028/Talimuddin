import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { commentService } from "../../services/common/comment.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError, CommentsResponse } from "../../types";

interface CommentMutationProps {
  postId: string;
  invalidateKey: (string | undefined)[] | (string | undefined)[][];
}

const usePostComments = ({
  postId,
  enabled,
}: {
  postId: string;
  enabled: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      commentService.getPostComments(postId, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNextPage) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!postId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

const useAddComment = ({ postId, invalidateKey }: CommentMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      commentService.addComment(postId, content),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Dynamic Invalidation
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
      toast.error(error?.response?.data?.message);
    },
  });
};

const useDeleteComment = ({ postId, invalidateKey }: CommentMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Dynamic Invalidation
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
      toast.error(error?.response?.data?.message);
    },
  });
};

const useUpdateComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, content),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

const useToggleLikeComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.toggleLikeComment(commentId),

    onMutate: async (commentId) => {
      // Cancel background refetch to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Snapshot previous data for rollback on error
      const previousComments = queryClient.getQueriesData({
        queryKey: ["comments", postId],
      });

      // Optimistic Update - instant UI change
      queryClient.setQueriesData(
        { queryKey: ["comments", postId] },
        (oldData: InfiniteData<CommentsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                comments: page.data.comments.map((item) => {
                  if (item.comment._id === commentId) {
                    const isLiked = item.meta.isLiked;
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isLiked: !isLiked,
                      },
                      comment: {
                        ...item.comment,
                        likesCount:
                          (isLiked ? -1 : 1) + (item.comment.likesCount || 0),
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

      return { previousComments };
    },

    onError: (error: AxiosError<ApiError>, _commentId, context) => {
      // Rollback to previous state on error
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error?.response?.data?.message);
    },
  });
};

const commentHooks = {
  usePostComments,
  useAddComment,
  useDeleteComment,
  useUpdateComment,
  useToggleLikeComment,
} as const;

export { commentHooks };
