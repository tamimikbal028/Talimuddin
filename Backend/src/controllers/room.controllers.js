import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { roomActions, roomServices } from "../services/room.service.js";

// ==========================================
// 🚀 1. CREATE ROOM
// ==========================================
const createRoom = asyncHandler(async (req, res) => {
  const { room, meta } = await roomActions.createRoomService(
    req.body,
    req.user._id
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { room, meta }, "Room created successfully"));
});

// ==========================================
// 🚀 2. GET MY ROOMS
// ==========================================
const getMyRooms = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { rooms, pagination } = await roomServices.getMyRoomsService(
    req.user._id,
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { rooms, pagination },
        "My rooms fetched successfully"
      )
    );
});

// ==========================================
// 🚀 2.1. GET HIDDEN ROOMS
// ==========================================
const getHiddenRooms = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { rooms, pagination } = await roomServices.getHiddenRoomsService(
    req.user._id,
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { rooms, pagination },
        "Hidden rooms fetched successfully"
      )
    );
});

// ==========================================
// 🚀 3. GET ROOM DETAILS
// ==========================================
const getRoomDetails = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { room, meta } = await roomServices.getRoomDetailsService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { room, meta }, "Room details fetched successfully")
    );
});

// ==========================================
// 🚀 4. JOIN ROOM (by join code only)
// ==========================================
const joinRoom = asyncHandler(async (req, res) => {
  const { joinCode } = req.body;

  if (!joinCode) {
    throw new ApiError(400, "Join code is required");
  }

  const { roomId, roomName, isPending } = await roomActions.joinRoomService(
    req.user._id,
    joinCode
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId, roomName, isPending },
        isPending
          ? "Join request sent successfully"
          : "Joined room successfully"
      )
    );
});

// ==========================================
// 🚀 4.1. CANCEL JOIN REQUEST
// ==========================================
const cancelJoinRequest = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { roomId: id } = await roomActions.cancelJoinRequestService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id },
        "Join request cancelled successfully"
      )
    );
});

// ==========================================
// 🚀 4.2. ACCEPT JOIN REQUEST
// ==========================================
const acceptJoinRequest = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  const { roomId: id, userId: acceptedUserId } =
    await roomActions.acceptJoinRequestService(roomId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, userId: acceptedUserId },
        "Join request accepted successfully"
      )
    );
});

// ==========================================
// 🚀 4.3. REJECT JOIN REQUEST
// ==========================================
const rejectJoinRequest = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  const { roomId: id, userId: rejectedUserId } =
    await roomActions.rejectJoinRequestService(roomId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, userId: rejectedUserId },
        "Join request rejected successfully"
      )
    );
});

// ==========================================
// 🚀 5. TOGGLE ARCHIVE ROOM (Creator or Admin)
// ==========================================
const toggleArchiveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { roomId: id, isArchived } = await roomActions.toggleArchiveRoomService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, isArchived },
        isArchived
          ? "Room archived successfully"
          : "Room unarchived successfully"
      )
    );
});

// ==========================================
// 🚀 6. DELETE ROOM (Creator only)
// ==========================================
const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { roomId: id } = await roomActions.deleteRoomService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { roomId: id }, "Room deleted successfully"));
});

// ==========================================
// 🚀 7. HIDE ROOM (Member only)
// ==========================================
const hideRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { roomId: id, isHidden } = await roomActions.hideRoomService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, isHidden },
        isHidden ? "Room hidden from your list" : "Room unhidden"
      )
    );
});

// ==========================================
// 🚀 8. UPDATE ROOM (Creator or Admin)
// ==========================================
const updateRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { room } = await roomActions.updateRoomService(
    roomId,
    req.user._id,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { room }, "Room updated successfully"));
});

// ==========================================
// 🚀 9. UPDATE ROOM COVER IMAGE (Creator or Admin)
// ==========================================
const updateRoomCoverImage = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }

  const { room } = await roomActions.updateRoomCoverImageService(
    roomId,
    req.user._id,
    coverImageLocalPath
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { room }, "Room cover image updated successfully")
    );
});

// ==========================================
// 🚀 10. GET ROOM POSTS
// ==========================================
const getRoomPosts = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page, limit } = req.query;

  const { roomPostsAndMembers } = await import("../services/room.service.js");
  const { posts, pagination } = await roomPostsAndMembers.getRoomPostsService(
    roomId,
    req.user._id,
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, pagination },
        "Room posts fetched successfully"
      )
    );
});

// ==========================================
// 🚀 11. GET ROOM MEMBERS
// ==========================================
const getRoomMembers = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page, limit } = req.query;

  const { roomPostsAndMembers } = await import("../services/room.service.js");
  const { members, pagination, meta } =
    await roomPostsAndMembers.getRoomMembersService(
      roomId,
      req.user._id,
      page,
      limit
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { members, pagination, meta },
        "Room members fetched successfully"
      )
    );
});

// ==========================================
// 🚀 11.1. GET ROOM PENDING REQUESTS
// ==========================================
const getRoomPendingRequests = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page, limit } = req.query;

  const { roomServices } = await import("../services/room.service.js");
  const { requests, pagination } =
    await roomServices.getRoomPendingRequestsService(
      roomId,
      req.user._id,
      page,
      limit
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { requests, pagination },
        "Pending requests fetched successfully"
      )
    );
});

// ==========================================
// 🚀 LEAVE ROOM
// ==========================================
const leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const { roomId: leftRoomId } = await roomActions.leaveRoomService(
    roomId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { roomId: leftRoomId }, "Left room successfully")
    );
});

// ==========================================
// 🚀 12. GET ROOM PENDING POSTS
// ==========================================
const getRoomPendingPosts = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page, limit } = req.query;

  const { posts, pagination } = await roomServices.getRoomPendingPostsService(
    roomId,
    req.user._id,
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, pagination },
        "Pending posts fetched successfully"
      )
    );
});

// ==========================================
// 🚀 13. APPROVE POST
// ==========================================
const approvePost = asyncHandler(async (req, res) => {
  const { roomId, postId } = req.params;

  const { status } = await roomServices.approveRoomPostService(
    roomId,
    postId,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { status }, "Post approved successfully"));
});

// ==========================================
// 🚀 14. REJECT POST
// ==========================================
const rejectPost = asyncHandler(async (req, res) => {
  const { roomId, postId } = req.params;

  const { status } = await roomServices.rejectRoomPostService(
    roomId,
    postId,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { status }, "Post rejected successfully"));
});

// ==========================================
// 🚀 15. REMOVE MEMBER
// ==========================================
const removeMember = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  const { roomId: id, userId: removedUserId } =
    await roomActions.removeMemberService(roomId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, userId: removedUserId },
        "Member removed successfully"
      )
    );
});

// ==========================================
// 🚀 16. PROMOTE TO ADMIN
// ==========================================
const promoteMember = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  const { roomId: id, userId: promotedUserId } =
    await roomActions.promoteMemberService(roomId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, userId: promotedUserId },
        "Member promoted to admin successfully"
      )
    );
});

// ==========================================
// 🚀 17. DEMOTE TO MEMBER
// ==========================================
const demoteMember = asyncHandler(async (req, res) => {
  const { roomId, userId } = req.params;

  const { roomId: id, userId: demotedUserId } =
    await roomActions.demoteMemberService(roomId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { roomId: id, userId: demotedUserId },
        "Admin demoted to member successfully"
      )
    );
});

export {
  createRoom,
  getMyRooms,
  getRoomDetails,
  joinRoom,
  cancelJoinRequest,
  acceptJoinRequest,
  rejectJoinRequest,
  removeMember,
  promoteMember,
  demoteMember,
  toggleArchiveRoom,
  deleteRoom,
  hideRoom,
  updateRoom,
  updateRoomCoverImage,
  getRoomPosts,
  getRoomMembers,
  getRoomPendingRequests,
  leaveRoom,
  getRoomPendingPosts,
  approvePost,
  rejectPost,
};
