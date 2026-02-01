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
import { useParams } from "react-router-dom";
import { AUTH_KEYS } from "./useAuth";

const FIVE_MIN = 1000 * 60 * 5;

const defaultProfileQueryOptions = {
  staleTime: FIVE_MIN,
  retry: 1,
};

const useProfileHeader = () => {
  const { username } = useParams();
  return useQuery({
    queryKey: ["profileHeader", username],
    queryFn: async () => {
      const response = await profileService.getProfileHeader(
        username as string
      );
      return response.data;
    },
    ...defaultProfileQueryOptions,
  });
};

// Update hooks
const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileService.updateGeneral(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      // Invalidate branch queries since user name appears on branch cards
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
      queryClient.invalidateQueries({ queryKey: ["hiddenBranches"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });
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
    queryFn: ({ pageParam }) => {
      if (!username) throw new Error("Username is required");
      return profileService.getProfilePosts(username, pageParam as number);
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

const profileHooks = {
  useProfileHeader,
  useUpdateGeneral,
  useUpdateAvatar,
  useUpdateCoverImage,
  useProfilePosts,
  useCreateProfilePost,
  useDeleteProfilePost,
  useUpdateProfilePost,
  useToggleReadStatusProfilePost,
  useToggleBookmarkProfilePost,
  useTogglePinProfilePost,
} as const;

export { profileHooks };
