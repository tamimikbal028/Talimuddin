import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { branchService } from "../services/branch.service";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { authHooks } from "./useAuth";
import type {
  ApiError,
  UpdateBranchData,
  BranchDetailsResponse,
  MyBranchesResponse,
  BranchMembersResponse,
} from "../types";
import { postHooks } from "./common/usePost";

const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchData: {
      name: string;
      description?: string;
      branchType: string;
      parentBranchJoinCode?: string;
    }) => branchService.createBranch(branchData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create branch");
    },
  });
};

const useMyBranches = () => {
  return useInfiniteQuery<MyBranchesResponse, AxiosError<ApiError>>({
    queryKey: ["myBranches", "infinite"],
    queryFn: ({ pageParam }) =>
      branchService.getMyBranches(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useAllBranches = () => {
  return useInfiniteQuery<MyBranchesResponse, AxiosError<ApiError>>({
    queryKey: ["allBranches", "infinite"],
    queryFn: ({ pageParam }) =>
      branchService.getAllBranches(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useBranchDetails = () => {
  const { branchId } = useParams();
  return useQuery<BranchDetailsResponse, AxiosError<ApiError>>({
    queryKey: ["branchDetails", branchId],
    queryFn: () => branchService.getBranchDetails(branchId as string),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

const useJoinBranch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (joinCode: string) => branchService.joinBranch(joinCode),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
      queryClient.invalidateQueries({ queryKey: ["branchDetails"] });

      // Navigate to branch details
      const branchId = data.data.branchId;
      if (branchId) {
        navigate(`/branch/branches/${branchId}`);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to join branch");
    },
  });
};

const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: string) => branchService.deleteBranch(branchId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
      // navigate("/branch");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete branch");
    },
  });
};

const useLeaveBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: string) => branchService.leaveBranch(branchId),
    onSuccess: (data) => {
      toast.success(data.message);

      // Invalidate all branch queries
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });

      // Navigate back
      // navigate("/branch");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to leave branch");
    },
  });
};

const useUpdateBranchDetails = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateBranchData) =>
      branchService.updateBranch(branchId as string, updateData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["branchDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update branch details"
      );
    },
  });
};

const useUpdateBranchCoverImage = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverImage: File) =>
      branchService.updateBranchCoverImage(branchId as string, coverImage),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["branchDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myBranches"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update branch cover image"
      );
    },
  });
};

// ====================================
// Branch Posts & Members
// ====================================

const useBranchPosts = () => {
  const { branchId } = useParams();
  return useInfiniteQuery({
    queryKey: ["branchPosts", branchId],
    queryFn: ({ pageParam }) =>
      branchService.getBranchPosts(branchId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!branchId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

const useBranchMembers = () => {
  const { branchId } = useParams();
  const { user: currentUser } = authHooks.useUser();

  return useInfiniteQuery<BranchMembersResponse, AxiosError<ApiError>>({
    queryKey: ["branchMembers", branchId],
    queryFn: async ({ pageParam }) => {
      const response = await branchService.getBranchMembers(
        branchId as string,
        pageParam as number
      );

      const isRequesterAdmin = response.data.meta.isRequesterAdmin;
      const isAppAdmin =
        currentUser?.userType === "OWNER" || currentUser?.userType === "ADMIN";

      // Inject meta into each member to maintain compatibility with BranchMemberCard
      response.data.members = response.data.members.map((member) => ({
        ...member,
        meta: {
          isSelf: member.user._id === currentUser?._id,
          isAdmin: member.isAdmin,
          joinedAt: member.joinedAt,
          canManage:
            (isRequesterAdmin || isAppAdmin) &&
            member.user._id !== currentUser?._id,
          memberId: member.user._id,
        },
      }));

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!branchId && !!currentUser,
    staleTime: Infinity,
  });
};

// Branch Post Actions - Using Common Hooks
const useCreateBranchPost = () => {
  const { branchId } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["branchPosts", branchId],
      ["branchDetails", branchId],
    ],
  });
};

const useDeleteBranchPost = () => {
  const { branchId } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["branchPosts", branchId],
    invalidateKey: [
      ["branchPosts", branchId],
      ["branchDetails", branchId],
    ],
  });
};

const useUpdateBranchPost = () => {
  const { branchId } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["branchPosts", branchId],
    invalidateKey: ["branchPosts", branchId],
  });
};

const useToggleReadStatusBranchPost = () => {
  const { branchId } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: [["branchPosts", branchId]],
    invalidateKey: [],
  });
};

const useToggleBookmarkBranchPost = () => {
  const { branchId } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["branchPosts", branchId],
    invalidateKey: ["branchPosts", branchId],
  });
};

// ====================================
// Join Request Management
// ====================================

const useRemoveBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.removeMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["branchDetails", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    },
  });
};

const usePromoteBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.promoteMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to promote member");
    },
  });
};

const useDemoteBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.demoteMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to demote member");
    },
  });
};

const branchHooks = {
  useCreateBranch,
  useMyBranches,
  useAllBranches,
  useBranchDetails,
  useJoinBranch,
  useDeleteBranch,
  useLeaveBranch,
  useUpdateBranchDetails,
  useUpdateBranchCoverImage,

  // Posts & Members
  useBranchPosts,
  useBranchMembers,

  // Post Actions
  useCreateBranchPost,
  useDeleteBranchPost,
  useUpdateBranchPost,
  useToggleReadStatusBranchPost,
  useToggleBookmarkBranchPost,

  // Join Request Management
  useRemoveBranchMember,
  usePromoteBranchMember,
  useDemoteBranchMember,

  // Pending Requests Logic
  useBranchPendingRequests: () => {
    const { branchId } = useParams();
    return useQuery({
      queryKey: ["branchPendingRequests", branchId],
      queryFn: () => branchService.getPendingRequests(branchId as string),
      enabled: !!branchId,
    });
  },

  useApproveJoinRequest: () => {
    const { branchId } = useParams();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (userId: string) =>
        branchService.approveJoinRequest(branchId as string, userId),
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries({
          queryKey: ["branchPendingRequests", branchId],
        });
        queryClient.invalidateQueries({
          queryKey: ["branchMembers", branchId],
        });
        queryClient.invalidateQueries({
          queryKey: ["branchDetails", branchId],
        });
      },
      onError: (error: AxiosError<ApiError>) => {
        toast.error(
          error?.response?.data?.message || "Failed to approve request"
        );
      },
    });
  },

  useRejectJoinRequest: () => {
    const { branchId } = useParams();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (userId: string) =>
        branchService.rejectJoinRequest(branchId as string, userId),
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries({
          queryKey: ["branchPendingRequests", branchId],
        });
      },
      onError: (error: AxiosError<ApiError>) => {
        toast.error(
          error?.response?.data?.message || "Failed to reject request"
        );
      },
    });
  },
} as const;

export { branchHooks };
