import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import type {
  UpdateGeneralData,
  ApiError,
  ProfilePostsResponse,
} from "../types";
import type { AxiosError } from "axios";
import { postHooks } from "./common/usePost";

import { commentHooks } from "./common/useComment";
import { useParams } from "react-router-dom";
import { AUTH_KEYS } from "./useAuth";

// Import Generic Utils

const FIVE_MIN = 1000 * 60 * 5;

const defaultProfileQueryOptions = {
  staleTime: FIVE_MIN,
  retry: 1,
};

const useProfileHeader = (username: string) =>
  useQuery({
    queryKey: ["profileHeader", username],
    queryFn: async () => {
      const response = await profileService.getProfileHeader(username);
      return response.data;
    },
    ...defaultProfileQueryOptions,
  });

// Update hooks
const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileService.updateGeneral(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update General failed");
    },
  });
};

const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => profileService.updateAvatar(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Avatar failed");
    },
  });
};

const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) =>
      profileService.updateCoverImage(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message ?? "Update Cover Image failed"
      );
    },
  });
};

// Post hooks
const useProfilePosts = (username?: string) =>
  useInfiniteQuery<ProfilePostsResponse>({
    queryKey: ["profilePosts", username],
    queryFn: async ({ pageParam }) => {
      if (!username) throw new Error("Username is required");
      const page = Number(pageParam ?? 1);
      const response = await profileService.getProfilePosts(username, page);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: Boolean(username),
    staleTime: FIVE_MIN,
  });

const useCreateProfilePost = () => {
  const { username } = useParams();
  return postHooks.useCreatePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useToggleLikeProfilePost = () => {
  const { username } = useParams();
  return postHooks.useToggleLikePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useDeleteProfilePost = () => {
  const { username } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useUpdateProfilePost = () => {
  const { username } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useToggleReadStatusProfilePost = () => {
  const { username } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useToggleBookmarkProfilePost = () => {
  const { username } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

const useTogglePinProfilePost = () => {
  const { username } = useParams();
  return postHooks.useTogglePin({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

// Comment hooks
const useAddProfileComment = ({ postId }: { postId: string }) => {
  return commentHooks.useAddComment({
    postId,
    invalidateKey: ["profilePosts"],
  });
};

const useDeleteProfileComment = ({ postId }: { postId: string }) => {
  return commentHooks.useDeleteComment({
    postId,
    invalidateKey: ["profilePosts"],
  });
};

const profileHooks = {
  useProfileHeader,
  useUpdateGeneral,
  useUpdateAvatar,
  useUpdateCoverImage,
  useProfilePosts,
  useCreateProfilePost,
  useToggleLikeProfilePost,
  useDeleteProfilePost,
  useUpdateProfilePost,
  useToggleReadStatusProfilePost,
  useToggleBookmarkProfilePost,
  useTogglePinProfilePost,
  useAddProfileComment,
  useDeleteProfileComment,
} as const;

export { profileHooks };
