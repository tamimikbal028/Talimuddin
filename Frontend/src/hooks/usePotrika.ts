import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import potrikaService from "../services/potrika.service";

export const usePotrikaHeader = () => {
  const { potrikaId } = useParams();

  return useQuery({
    queryKey: ["potrika", "header", potrikaId],
    queryFn: async () => {
      const response = await potrikaService.getPotrikaHeader(potrikaId!);
      return response.data;
    },
    enabled: !!potrikaId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePotrikaPosts = (potrikaId?: string) => {
  const params = useParams();
  const effectivePotrikaId = potrikaId || params.potrikaId;

  return useInfiniteQuery({
    queryKey: ["potrika", "posts", effectivePotrikaId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await potrikaService.getPotrikaPosts(
        effectivePotrikaId!,
        pageParam as number,
        10
      );
      return response;
    },
    enabled: !!effectivePotrikaId,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllPotrikas = () => {
  return useQuery({
    queryKey: ["potrikas"],
    queryFn: async () => {
      const response = await potrikaService.getAllPotrikas();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const potrikaHooks = {
  usePotrikaHeader,
  usePotrikaPosts,
  useAllPotrikas,
};

export default potrikaHooks;
