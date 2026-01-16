import { departmentService } from "../services/department.service";
import { useParams } from "react-router-dom";
import { followHooks } from "./common/useFollow";
import { postHooks } from "./common/usePost";
import { commentHooks } from "./common/useComment";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useDepartmentHeader = () => {
  const { deptId } = useParams();

  return useQuery({
    queryKey: ["departmentHeader", deptId],
    queryFn: () => departmentService.getDepartmentHeader(deptId as string),
    enabled: !!deptId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDepartmentDetails = () => {
  const { deptId } = useParams();

  return useQuery({
    queryKey: ["departmentDetails", deptId],
    queryFn: () => departmentService.getDepartmentDetails(deptId as string),
    enabled: !!deptId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useToggleFollowDepartment = () => {
  const { deptId } = useParams();

  return followHooks.useToggleFollow({
    invalidateKey: ["departmentHeader", deptId],
  });
};

export const useDepartmentFeed = () => {
  const { deptId } = useParams();

  return useInfiniteQuery({
    queryKey: ["departmentFeed", deptId],
    queryFn: ({ pageParam }) =>
      departmentService.getDepartmentFeed(
        deptId as string,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!deptId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ====================================
// Department Feed & Posts
// ====================================

const useCreateDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["departmentFeed", deptId],
      ["departmentHeader", deptId],
    ],
  });
};

// Department Post Like Toggle
const useToggleLikeDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useToggleLikePost({
    queryKey: ["departmentFeed", deptId],
    invalidateKey: [["departmentFeed", deptId]],
  });
};

// Department Post Delete
const useDeleteDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["departmentFeed", deptId],
    invalidateKey: [
      ["departmentFeed", deptId],
      ["departmentHeader", deptId],
    ],
  });
};

// Department Post Update
const useUpdateDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["departmentFeed", deptId],
    invalidateKey: [["departmentFeed", deptId]],
  });
};

// Department Post Read Status Toggle
const useToggleReadStatusDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: [["departmentFeed", deptId]],
    invalidateKey: [],
  });
};

// Department Post Bookmark Toggle
const useToggleBookmarkDepartmentPost = () => {
  const { deptId } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["departmentFeed", deptId],
    invalidateKey: [["departmentFeed", deptId]],
  });
};

// ====================================
// Department Comment Hooks
// ====================================

const useAddDepartmentComment = ({ postId }: { postId: string }) => {
  const { deptId } = useParams();
  return commentHooks.useAddComment({
    postId,
    invalidateKey: [["departmentFeed", deptId]],
  });
};

const useDeleteDepartmentComment = ({ postId }: { postId: string }) => {
  const { deptId } = useParams();
  return commentHooks.useDeleteComment({
    postId,
    invalidateKey: [["departmentFeed", deptId]],
  });
};

const departmentHooks = {
  // Queries
  useDepartmentHeader,
  useDepartmentDetails,
  useDepartmentFeed,

  // Actions
  useToggleFollowDepartment,

  // Posts
  useCreateDepartmentPost,
  useToggleLikeDepartmentPost,
  useDeleteDepartmentPost,
  useUpdateDepartmentPost,
  useToggleReadStatusDepartmentPost,
  useToggleBookmarkDepartmentPost,

  // Comments
  useAddDepartmentComment,
  useDeleteDepartmentComment,
} as const;

export { departmentHooks };
