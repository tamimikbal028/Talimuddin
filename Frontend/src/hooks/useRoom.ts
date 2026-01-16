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
import type {
  ApiError,
  UpdateRoomData,
  RoomDetailsResponse,
  MyRoomsResponse,
} from "../types";
import { postHooks } from "./common/usePost";

const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomData: {
      name: string;
      description?: string;
      roomType: string;
      parentRoomJoinCode?: string;
    }) => roomService.createRoom(roomData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      navigate("/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create room");
    },
  });
};

const useMyRooms = () => {
  return useInfiniteQuery<MyRoomsResponse, AxiosError<ApiError>>({
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

const useAllRooms = () => {
  return useInfiniteQuery<MyRoomsResponse, AxiosError<ApiError>>({
    queryKey: ["allRooms", "infinite"],
    queryFn: ({ pageParam }) => roomService.getAllRooms(pageParam as number),
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
  return useQuery<RoomDetailsResponse, AxiosError<ApiError>>({
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

const roomHooks = {
  useCreateRoom,
  useMyRooms,
  useAllRooms,
  useRoomDetails,
  useJoinRoom,
  useDeleteRoom,
  useLeaveRoom,
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
  useAcceptJoinRequest,
  useRejectJoinRequest,
  useRemoveRoomMember,
  usePromoteRoomMember,
  useDemoteRoomMember,
} as const;

export { roomHooks };
