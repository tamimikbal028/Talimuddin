import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { roomService } from "../services/room.service";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError, UpdateRoomData } from "../types";
import { postHooks } from "./common/usePost";

const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomData: {
      name: string;
      description?: string;
      roomType: string;
      allowStudentPosting: boolean;
      allowComments: boolean;
    }) => roomService.createRoom(roomData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });

      const roomId = data.data.room._id;
      if (roomId) {
        navigate(`/rooms/${roomId}`);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create room");
    },
  });
};

const useMyRooms = () => {
  return useInfiniteQuery({
    queryKey: ["myRooms", "infinite"],
    queryFn: ({ pageParam }) => roomService.getMyRooms(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useHiddenRooms = () => {
  return useInfiniteQuery({
    queryKey: ["hiddenRooms", "infinite"],
    queryFn: ({ pageParam }) => roomService.getHiddenRooms(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useArchivedRooms = () => {
  return useInfiniteQuery({
    queryKey: ["archivedRooms", "infinite"],
    queryFn: ({ pageParam }) =>
      roomService.getArchivedRooms(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useRoomDetails = () => {
  const { roomId } = useParams();
  return useQuery({
    queryKey: ["roomDetails", roomId],
    queryFn: () => roomService.getRoomDetails(roomId as string),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

const useJoinRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (joinCode: string) => roomService.joinRoom(joinCode),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });

      // Navigate to room details
      const roomId = data.data.roomId;
      if (roomId) {
        navigate(`/classroom/rooms/${roomId}`);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to join room");
    },
  });
};

const useToggleArchiveRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomId: string) => roomService.toggleArchiveRoom(roomId),
    onSuccess: (data) => {
      toast.success(data.message);

      // Invalidate all 3 tabs
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["hiddenRooms"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });

      // Redirect based on archive status
      navigate(data.data.isArchived ? "/classroom/archived" : "/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to archive/unarchive room"
      );
    },
  });
};

const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      navigate("/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete room");
    },
  });
};

const useLeaveRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomId: string) => roomService.leaveRoom(roomId),
    onSuccess: (data) => {
      toast.success(data.message);

      // Invalidate all room queries
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["hiddenRooms"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRooms"] });

      // Navigate back to classroom
      navigate("/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to leave room");
    },
  });
};

const useHideRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomId: string) => roomService.hideRoom(roomId),
    onSuccess: (data) => {
      toast.success(data.message);

      // Invalidate all 3 tabs
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["hiddenRooms"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });

      // Redirect based on hide status
      navigate(data.data.isHidden ? "/classroom/hidden" : "/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to hide/unhide room"
      );
    },
  });
};

const useUpdateRoomDetails = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateRoomData) =>
      roomService.updateRoom(roomId as string, updateData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update room details"
      );
    },
  });
};

const useUpdateRoomCoverImage = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverImage: File) =>
      roomService.updateRoomCoverImage(roomId as string, coverImage),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update room cover image"
      );
    },
  });
};

// ====================================
// Room Posts & Members
// ====================================

const useRoomPosts = () => {
  const { roomId } = useParams();
  return useInfiniteQuery({
    queryKey: ["roomPosts", roomId],
    queryFn: ({ pageParam }) =>
      roomService.getRoomPosts(roomId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

const useRoomMembers = () => {
  const { roomId } = useParams();
  return useInfiniteQuery({
    queryKey: ["roomMembers", roomId],
    queryFn: ({ pageParam }) =>
      roomService.getRoomMembers(roomId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!roomId,
    staleTime: Infinity,
  });
};

// Room Post Actions - Using Common Hooks
const useCreateRoomPost = () => {
  const { roomId } = useParams();
  return postHooks.useCreatePost({
    invalidateKey: [
      ["roomPosts", roomId],
      ["roomDetails", roomId],
    ],
  });
};

const useDeleteRoomPost = () => {
  const { roomId } = useParams();
  return postHooks.useDeletePost({
    queryKey: ["roomPosts", roomId],
    invalidateKey: [
      ["roomPosts", roomId],
      ["roomDetails", roomId],
    ],
  });
};

const useUpdateRoomPost = () => {
  const { roomId } = useParams();
  return postHooks.useUpdatePost({
    queryKey: ["roomPosts", roomId],
    invalidateKey: ["roomPosts", roomId],
  });
};

const useToggleReadStatusRoomPost = () => {
  const { roomId } = useParams();
  return postHooks.useToggleReadStatus({
    queryKey: [["roomPosts", roomId]],
    invalidateKey: [],
  });
};

const useToggleBookmarkRoomPost = () => {
  const { roomId } = useParams();
  return postHooks.useToggleBookmark({
    queryKey: ["roomPosts", roomId],
    invalidateKey: ["roomPosts", roomId],
  });
};

// ====================================
// Join Request Management
// ====================================

const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => roomService.cancelJoinRequest(roomId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel join request"
      );
    },
  });
};

const useAcceptJoinRequest = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.acceptJoinRequest(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomPendingRequests", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetails", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomMembers", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    },
  });
};

const useRejectJoinRequest = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.rejectJoinRequest(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomPendingRequests", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetails", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    },
  });
};

const useBanMember = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.banMember(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomMembers", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetails", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to ban member");
    },
  });
};

const useRemoveRoomMember = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.removeMember(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomMembers", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roomDetails", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    },
  });
};

const usePromoteRoomMember = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.promoteMember(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomMembers", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to promote member");
    },
  });
};

const useDemoteRoomMember = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      roomService.demoteMember(roomId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["roomMembers", roomId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to demote member");
    },
  });
};

const useRoomPendingRequests = () => {
  const { roomId } = useParams();
  return useInfiniteQuery({
    queryKey: ["roomPendingRequests", roomId],
    queryFn: ({ pageParam }) =>
      roomService.getRoomPendingRequests(roomId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!roomId,
    staleTime: Infinity,
  });
};

const useRoomPendingPosts = () => {
  const { roomId } = useParams();
  return useInfiniteQuery({
    queryKey: ["roomPendingPosts", roomId],
    queryFn: ({ pageParam }) =>
      roomService.getRoomPendingPosts(roomId as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

const useApproveRoomPost = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      roomService.approveRoomPost(roomId as string, postId),
    onSuccess: () => {
      toast.success("Post approved successfully");
      queryClient.invalidateQueries({ queryKey: ["roomPendingPosts", roomId] });
      queryClient.invalidateQueries({ queryKey: ["roomPosts", roomId] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails", roomId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to approve post");
    },
  });
};

const useRejectRoomPost = () => {
  const { roomId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      roomService.rejectRoomPost(roomId as string, postId),
    onSuccess: () => {
      toast.success("Post rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["roomPendingPosts", roomId] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails", roomId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to reject post");
    },
  });
};

const roomHooks = {
  useCreateRoom,
  useMyRooms,
  useHiddenRooms,
  useArchivedRooms,
  useRoomDetails,
  useJoinRoom,
  useToggleArchiveRoom,
  useDeleteRoom,
  useLeaveRoom,
  useHideRoom,
  useUpdateRoomDetails,
  useUpdateRoomCoverImage,

  // Posts & Members
  useRoomPosts,
  useRoomMembers,
  useRoomPendingRequests,

  // Post Actions
  useCreateRoomPost,
  useDeleteRoomPost,
  useUpdateRoomPost,
  useToggleReadStatusRoomPost,
  useToggleBookmarkRoomPost,

  // Join Request Management
  useCancelJoinRequest,
  useAcceptJoinRequest,
  useRejectJoinRequest,
  useBanMember,
  useRemoveRoomMember,
  usePromoteRoomMember,
  useDemoteRoomMember,

  // Post Moderation
  useRoomPendingPosts,
  useApproveRoomPost,
  useRejectRoomPost,
} as const;

export { roomHooks };
