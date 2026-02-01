import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import potrikaApi from "../api/potrika";
import { toast } from "sonner";

// Hook to get potrika header
export const usePotrikaHeader = () => {
  const { potrikaId } = useParams();

  return useQuery({
    queryKey: ["potrika", "header", potrikaId],
    queryFn: async () => {
      const response = await potrikaApi.getPotrikaHeader(potrikaId!);
      return response.data.data;
    },
    enabled: !!potrikaId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get potrika posts with infinite scroll
export const usePotrikaPosts = (potrikaId?: string) => {
  const params = useParams();
  const effectivePotrikaId = potrikaId || params.potrikaId;

  return useInfiniteQuery({
    queryKey: ["potrika", "posts", effectivePotrikaId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await potrikaApi.getPotrikaPosts(
        effectivePotrikaId!,
        pageParam,
        10
      );
      return response.data;
    },
    enabled: !!effectivePotrikaId,
    getNextPageParam: (lastPage) => {
      const { currentPage, hasNextPage } = lastPage.data.pagination;
      return hasNextPage ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a post on potrika
export const useCreatePotrikaPost = () => {
  const { potrikaId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: potrikaApi.createPotrikaPost,
    onSuccess: () => {
      // Invalidate potrika posts query to refetch
      queryClient.invalidateQueries({
        queryKey: ["potrika", "posts", potrikaId],
      });
      // Invalidate potrika header to update post count
      queryClient.invalidateQueries({
        queryKey: ["potrika", "header", potrikaId],
      });
      toast.success("Post created successfully!");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create post";
      toast.error(errorMessage);
    },
  });
};

export const potrikaHooks = {
  usePotrikaHeader,
  usePotrikaPosts,
  useCreatePotrikaPost,
};

export default potrikaHooks;
