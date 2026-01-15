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
import type { ApiError } from "../types";
import { postHooks } from "./common/usePost";
import { commentHooks } from "./common/useComment";

const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (roomData: {
      name: string;
      description?: string;
      roomType: string;
      allowStudentPosting?: boolean;
      allowComments?: boolean;
    }) => roomService.createRoom(roomData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });

      const roomId = data.data.room?._id;
      if (roomId) {
        navigate(`/rooms/${roomId}`);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create room");
    },
  });
};

const useAllRooms = () => {
  return useInfiniteQuery({
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

const useRoomDetails = (roomId: string | undefined) => {
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

  return useMutation({
    mutationFn: (joinCode: string) => roomService.joinRoom(joinCode),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["allRooms"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to join room");
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
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
      queryClient.invalidateQueries({ queryKey: ["allRooms"] });
      queryClient.invalidateQueries({ queryKey: ["roomDetails"] });
      navigate("/classroom/my");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to leave room");
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
      queryClient.invalidateQueries({ queryKey: ["allRooms"] });
      navigate("/classroom");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete room");
    },
  });
};

const useUpdateRoomDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      updateData,
    }: {
      roomId: string;
      updateData: {
        name?: string;
        description?: string;
        roomType?: string;
        settings?: {
          allowStudentPosting?: boolean;
          allowComments?: boolean;
        };
      };
    }) => roomService.updateRoom(roomId, updateData),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      coverImage,
    }: {
      roomId: string;
      coverImage: File;
    }) => roomService.updateRoomCoverImage(roomId, coverImage),
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
    invalidateKey: [["roomPosts", roomId]],
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
    invalidateKey: [["roomPosts", roomId]],
  });
};

// Room Comment Hooks
const useAddRoomComment = ({ postId }: { postId: string }) => {
  const { roomId } = useParams();
  return commentHooks.useAddComment({
    postId,
    invalidateKey: [["roomPosts", roomId]],
  });
};

const useDeleteRoomComment = ({ postId }: { postId: string }) => {
  const { roomId } = useParams();
  return commentHooks.useDeleteComment({
    postId,
    invalidateKey: [["roomPosts", roomId]],
  });
};

const roomHooks = {
  useCreateRoom,
  useAllRooms,
  useMyRooms,
  useRoomDetails,
  useJoinRoom,
  useLeaveRoom,
  useDeleteRoom,
  useUpdateRoomDetails,
  useUpdateRoomCoverImage,

  // Posts & Members
  useRoomPosts,
  useRoomMembers,

  // Post Actions
  useCreateRoomPost,
  useDeleteRoomPost,
  useUpdateRoomPost,
  useToggleReadStatusRoomPost,
  useToggleBookmarkRoomPost,

  // Comments
  useAddRoomComment,
  useDeleteRoomComment,
} as const;

export { roomHooks };
