import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { institutionService } from "../services/institution.service";
import { useParams } from "react-router-dom";
import { followHooks } from "./common/useFollow";
import { postHooks } from "./common/usePost";
import { commentHooks } from "./common/useComment";

export const useInstitutionHeader = () => {
  const { instId } = useParams();

  return useQuery({
    queryKey: ["institutionHeader", instId],
    queryFn: () => institutionService.getInstitutionHeader(instId as string),
    enabled: !!instId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useInstitutionDetails = () => {
  const { instId } = useParams();

  return useQuery({
    queryKey: ["institutionDetails", instId],
    queryFn: () => institutionService.getInstitutionDetails(instId as string),
    enabled: !!instId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useToggleFollowInstitution = () => {
  const { instId } = useParams();

  return followHooks.useToggleFollow({
    invalidateKey: ["institutionHeader", instId],
  });
};

export const useInstitutionFeed = () => {
  const { instId } = useParams();

  return useInfiniteQuery({
    queryKey: ["institutionFeed", instId],
    queryFn: ({ pageParam }) =>
      institutionService.getInstitutionFeed(
        instId as string,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!instId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInstitutionDepartments = () => {
  const { instId } = useParams();

  return useQuery({
    queryKey: ["institutionDepartments", instId],
    queryFn: () => institutionService.getDepartmentsList(instId as string),
    enabled: !!instId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ====================================
// Institution Feed & Posts
// ====================================

const useCreateInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["institutionFeed", instId],
      ["institutionHeader", instId],
    ],
  });
};

// Institution Post Like Toggle
const useToggleLikeInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useToggleLikePost({
    queryKey: ["institutionFeed", instId],
    invalidateKey: [["institutionFeed", instId]],
  });
};

// Institution Post Delete
const useDeleteInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["institutionFeed", instId],
    invalidateKey: [
      ["institutionFeed", instId],
      ["institutionHeader", instId],
    ],
  });
};

// Institution Post Update
const useUpdateInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["institutionFeed", instId],
    invalidateKey: [["institutionFeed", instId]],
  });
};

// Institution Post Read Status Toggle
const useToggleReadStatusInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: [["institutionFeed", instId]],
    invalidateKey: [],
  });
};

// Institution Post Bookmark Toggle
const useToggleBookmarkInstitutionPost = () => {
  const { instId } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["institutionFeed", instId],
    invalidateKey: [["institutionFeed", instId]],
  });
};

// ====================================
// Institution Comment Hooks
// ====================================

const useAddInstitutionComment = ({ postId }: { postId: string }) => {
  const { instId } = useParams();
  return commentHooks.useAddComment({
    postId,
    invalidateKey: [["institutionFeed", instId]],
  });
};

const useDeleteInstitutionComment = ({ postId }: { postId: string }) => {
  const { instId } = useParams();
  return commentHooks.useDeleteComment({
    postId,
    invalidateKey: [["institutionFeed", instId]],
  });
};

const institutionHooks = {
  // Queries
  useInstitutionHeader,
  useInstitutionDetails,
  useInstitutionFeed,
  useInstitutionDepartments,

  // Actions
  useToggleFollowInstitution,

  // Posts
  useCreateInstitutionPost,
  useToggleLikeInstitutionPost,
  useDeleteInstitutionPost,
  useUpdateInstitutionPost,
  useToggleReadStatusInstitutionPost,
  useToggleBookmarkInstitutionPost,

  // Comments
  useAddInstitutionComment,
  useDeleteInstitutionComment,
} as const;

export { institutionHooks };
