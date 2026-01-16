import { Room } from "../models/room.model.js";
import { RoomMembership } from "../models/roomMembership.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { POST_TARGET_MODELS } from "../constants/index.js";

// ==========================================
// ROOM ACTIONS
// ==========================================
const roomActions = {
  // 🚀 CREATE ROOM (Teachers only)
  createRoomService: async (roomData, userId) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Only teachers can create rooms
    if (user.userType !== "TEACHER") {
      throw new ApiError(403, "Only teachers can create rooms");
    }

    // Generate unique 6-character alphanumeric join code
    const generateJoinCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars: 0,O,1,I
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let joinCode = generateJoinCode();
    let isUnique = false;

    while (!isUnique) {
      const existing = await Room.findOne({ joinCode });
      if (!existing) {
        isUnique = true;
      } else {
        joinCode = generateJoinCode();
      }
    }

    // Create Room
    const room = await Room.create({
      name: roomData.name,
      description: roomData.description || "No description provided.",
      roomType: roomData.roomType,
      privacy: roomData.privacy,
      coverImage:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop",
      creator: userId,
      joinCode,
      isArchived: false,
      isDeleted: false,
      membersCount: 0, // Start at 0, will be incremented by RoomMembership hook
      postsCount: 0,
      settings: {
        allowStudentPosting: roomData.allowStudentPosting,
        allowComments: roomData.allowComments,
      },
    });

    if (!room) {
      throw new ApiError(500, "Failed to create room");
    }

    // Add Creator as Member with JOINED status
    await RoomMembership.create({
      room: room._id,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      isCR: false,
      isAdmin: false,
      isHidden: false,
    });

    // Increment member count
    await Room.findByIdAndUpdate(room._id, { $inc: { membersCount: 1 } });

    const meta = {
      isMember: true,
      isCreator: true,
      isAdmin: false, // Creator is not admin by default
    };

    return { room, meta };
  },

  // 🚀 JOIN ROOM (via join code only)
  joinRoomService: async (userId, joinCode) => {
    const { ROOM_PRIVACY, ROOM_MEMBERSHIP_STATUS } = await import(
      "../constants/index.js"
    );

    // Find room by join code
    const room = await Room.findOne({ joinCode });

    if (!room) {
      throw new ApiError(404, "Invalid join code");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isArchived) {
      throw new ApiError(403, "Cannot join archived room");
    }

    // Check if already member or has pending request
    const existing = await RoomMembership.findOne({
      room: room._id,
      user: userId,
    });

    if (existing) {
      if (existing.status === ROOM_MEMBERSHIP_STATUS.JOINED) {
        throw new ApiError(400, "Already a member of this room");
      }
      if (existing.status === ROOM_MEMBERSHIP_STATUS.PENDING) {
        throw new ApiError(400, "Join request already pending");
      }

      if (existing.status === ROOM_MEMBERSHIP_STATUS.REJECTED) {
        throw new ApiError(
          403,
          "Your join request was rejected. Please contact the room creator."
        );
      }
    }

    // Check privacy level
    if (room.privacy === ROOM_PRIVACY.CLOSED) {
      throw new ApiError(403, "This room is closed.");
    }

    if (room.privacy === ROOM_PRIVACY.PRIVATE) {
      // Create pending join request
      await RoomMembership.create({
        room: room._id,
        user: userId,
        status: ROOM_MEMBERSHIP_STATUS.PENDING,
        isCR: false,
        isAdmin: false,
        isHidden: false,
      });

      return {
        roomId: room._id,
        roomName: room.name,
        isPending: true,
      };
    }

    // PUBLIC room - join directly
    await RoomMembership.create({
      room: room._id,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      isCR: false,
      isAdmin: false,
      isHidden: false,
    });

    // Increment member count for PUBLIC room
    await Room.findByIdAndUpdate(room._id, { $inc: { membersCount: 1 } });

    return {
      roomId: room._id,
      roomName: room.name,
      isPending: false,
    };
  },

  // 🚀 CANCEL JOIN REQUEST
  cancelJoinRequestService: async (roomId, userId) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.PENDING,
    });

    if (!membership) {
      throw new ApiError(404, "No pending join request found");
    }

    // Hard delete the pending request
    await RoomMembership.findByIdAndDelete(membership._id);

    return { roomId: room._id };
  },

  // 🚀 ACCEPT JOIN REQUEST (Creator or Admin)
  acceptJoinRequestService: async (roomId, creatorOrAdminId, targetUserId) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if requester is creator or admin
    const isCreator = room.creator.toString() === creatorOrAdminId.toString();
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    if (!isCreator && !requesterMembership?.isAdmin) {
      throw new ApiError(
        403,
        "Only room creator or admin can accept join requests"
      );
    }

    // Find pending membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
      status: ROOM_MEMBERSHIP_STATUS.PENDING,
    });

    if (!membership) {
      throw new ApiError(404, "No pending join request found for this user");
    }

    // Update status to JOINED
    membership.status = ROOM_MEMBERSHIP_STATUS.JOINED;
    await membership.save();

    // Increment member count
    await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: 1 } });

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 REJECT JOIN REQUEST (Creator or Admin)
  rejectJoinRequestService: async (roomId, creatorOrAdminId, targetUserId) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if requester is creator or admin
    const isCreator = room.creator.toString() === creatorOrAdminId.toString();
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    if (!isCreator && !requesterMembership?.isAdmin) {
      throw new ApiError(
        403,
        "Only room creator or admin can reject join requests"
      );
    }

    // Find pending membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
      status: ROOM_MEMBERSHIP_STATUS.PENDING,
    });

    if (!membership) {
      throw new ApiError(404, "No pending join request found for this user");
    }

    // Update status to REJECTED
    membership.status = ROOM_MEMBERSHIP_STATUS.REJECTED;
    await membership.save();

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 ARCHIVE/UNARCHIVE ROOM (Creator or Admin)
  toggleArchiveRoomService: async (roomId, userId) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is creator or admin
    const isCreator = room.creator.toString() === userId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(
        403,
        "Only room creator or admin can archive/unarchive room"
      );
    }

    room.isArchived = !room.isArchived;
    await room.save();

    return {
      roomId: room._id,
      isArchived: room.isArchived,
    };
  },

  // 🚀 REMOVE MEMBER (Creator or Admin)
  removeMemberService: async (roomId, creatorOrAdminId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check if requester is creator or admin
    const isCreator = room.creator.toString() === creatorOrAdminId.toString();
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    if (!isCreator && !requesterMembership?.isAdmin) {
      throw new ApiError(403, "Only room creator or admin can remove members");
    }

    // Cannot remove creator
    if (room.creator.toString() === targetUserId.toString()) {
      throw new ApiError(400, "Cannot remove the room creator");
    }

    const targetMembership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
    });

    if (!targetMembership) {
      throw new ApiError(404, "User is not a member of this room");
    }

    // Admin cannot remove another Admin (only Creator can)
    if (!isCreator && targetMembership.isAdmin) {
      throw new ApiError(403, "Admins cannot remove other admins");
    }

    // Hard delete membership
    await RoomMembership.findByIdAndDelete(targetMembership._id);

    // Decrement member count
    await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: -1 } });

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 PROMOTE TO ADMIN (Creator only)
  promoteMemberService: async (roomId, creatorId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Only creator can promote to admin
    if (room.creator.toString() !== creatorId.toString()) {
      throw new ApiError(403, "Only room creator can promote members to admin");
    }

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
    });

    if (!membership) {
      throw new ApiError(404, "User is not a member of this room");
    }

    if (membership.isAdmin) {
      throw new ApiError(400, "User is already an admin");
    }

    membership.isAdmin = true;
    await membership.save();

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 DEMOTE TO MEMBER (Creator only)
  demoteMemberService: async (roomId, creatorId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Only creator can demote admin
    if (room.creator.toString() !== creatorId.toString()) {
      throw new ApiError(403, "Only room creator can demote admins");
    }

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
    });

    if (!membership) {
      throw new ApiError(404, "User is not a member of this room");
    }

    if (!membership.isAdmin) {
      throw new ApiError(400, "User is not an admin");
    }

    membership.isAdmin = false;
    await membership.save();

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 DELETE ROOM (Creator only)
  deleteRoomService: async (roomId, userId) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room already deleted");
    }

    // Only creator can delete
    if (room.creator.toString() !== userId.toString()) {
      throw new ApiError(403, "Only room creator can delete room");
    }

    // 1. Soft Delete Room
    room.isDeleted = true;
    await room.save();

    // 2. Soft Delete All Memberships
    await RoomMembership.updateMany(
      { room: roomId, isDeleted: false },
      { isDeleted: true }
    );

    // 3. Find all posts of this room
    const roomPosts = await Post.find({
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
      isDeleted: false,
    }).select("_id");

    const postIds = roomPosts.map((p) => p._id);

    // 4. Soft Delete All Posts and their Comments
    if (postIds.length > 0) {
      // Soft delete posts
      await Post.updateMany({ _id: { $in: postIds } }, { isDeleted: true });
    }

    return {
      roomId: room._id,
    };
  },

  // 🚀 HIDE ROOM (Member only - personal action)
  hideRoomService: async (roomId, userId) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!membership) {
      throw new ApiError(403, "You are not a member of this room");
    }

    // Toggle hide status
    membership.isHidden = !membership.isHidden;
    await membership.save();

    return {
      roomId: room._id,
      isHidden: membership.isHidden,
    };
  },

  // 🚀 UPDATE ROOM (Creator or Admin)
  updateRoomService: async (roomId, userId, updateData) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is creator or admin
    const isCreator = room.creator.toString() === userId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(
        403,
        "Only room creator or admin can update room details"
      );
    }

    // Update allowed fields
    if (updateData.name) room.name = updateData.name;
    if (updateData.description !== undefined)
      room.description = updateData.description;
    if (updateData.roomType) room.roomType = updateData.roomType;
    if (updateData.privacy) room.privacy = updateData.privacy;
    if (updateData.settings) {
      room.settings = {
        ...room.settings,
        ...updateData.settings,
      };
    }

    await room.save();

    return { room };
  },

  // 🚀 UPDATE ROOM COVER IMAGE (Creator or Admin)
  updateRoomCoverImageService: async (roomId, userId, localFilePath) => {
    if (!localFilePath) throw new ApiError(400, "Cover image missing");

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is creator or admin
    const isCreator = room.creator.toString() === userId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(403, "Permission denied");
    }

    const { uploadFile, deleteFile } = await import(
      "../utils/cloudinaryFileUpload.js"
    );

    const cover = await uploadFile(localFilePath);
    if (!cover?.url) throw new ApiError(500, "Failed to upload cover image");

    // Extract old public ID and delete if exists
    if (room.coverImage && room.coverImage.includes("cloudinary")) {
      const publicId = room.coverImage.split("/").pop().split(".")[0];
      await deleteFile(publicId);
    }

    room.coverImage = cover.url;
    await room.save();

    return { room };
  },

  // 🚀 LEAVE ROOM
  leaveRoomService: async (roomId, userId) => {
    // 1. Check if room exists
    const room = await Room.findOne({ _id: roomId });

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    // Check for soft deleted room
    if (room.isDeleted) {
      throw new ApiError(404, "This room has been deleted");
    }

    // 2. Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!membership) {
      throw new ApiError(404, "You are not a member of this room");
    }

    // 3. Check if Owner
    if (room.creator.toString() === userId.toString()) {
      throw new ApiError(
        400,
        "Owner cannot leave the room. Please archive or delete the room instead."
      );
    }

    // 4. Remove membership (Admin or Member)
    await RoomMembership.findByIdAndDelete(membership._id);

    // 5. Decrement member count
    await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: -1 } });

    return { roomId: room._id };
  },
};

// ==========================================
// ROOM SERVICES
// ==========================================
const roomServices = {
  // 🚀 GET MY ROOMS
  getMyRoomsService: async (userId, page = 1, limit = 10) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");
    const skip = (page - 1) * limit;

    // Get all room IDs that are not deleted and not archived
    const validRooms = await Room.find({
      isDeleted: false,
    }).distinct("_id");

    // Find memberships for valid rooms only (JOINED status)
    const memberships = await RoomMembership.find({
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      room: { $in: validRooms },
    })
      .populate({
        path: "room",
        select: "name coverImage",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const rooms = memberships.map((membership) => {
      const room = membership.room;
      return {
        _id: room._id,
        name: room.name,
        coverImage: room.coverImage,
      };
    });

    // Get total count
    const totalDocs = await RoomMembership.countDocuments({
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      room: { $in: validRooms },
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { rooms, pagination };
  },

  // 🚀 GET HIDDEN ROOMS
  getHiddenRoomsService: async (userId, page = 1, limit = 10) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");
    const skip = (page - 1) * limit;

    // Get all room IDs that are not deleted and not archived
    const validRooms = await Room.find({
      isDeleted: false,
    }).distinct("_id");

    // Find memberships for valid rooms only (JOINED status)
    const memberships = await RoomMembership.find({
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      room: { $in: validRooms },
    })
      .populate({
        path: "room",
        select: "name coverImage",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const rooms = memberships.map((membership) => {
      const room = membership.room;
      return {
        _id: room._id,
        name: room.name,
        coverImage: room.coverImage,
      };
    });

    // Get total count
    const totalDocs = await RoomMembership.countDocuments({
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      room: { $in: validRooms },
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { rooms, pagination };
  },

  // 🚀 GET ROOM DETAILS
  getRoomDetailsService: async (roomId, userId) => {
    const { ROOM_MEMBERSHIP_STATUS, POST_STATUS, POST_TARGET_MODELS } =
      await import("../constants/index.js");

    const room = await Room.findById(roomId).populate(
      "creator",
      "fullName userName avatar"
    );

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room has been deleted");
    }

    // Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const user = await User.findById(userId);

    const isCreator = room.creator._id.toString() === userId.toString();
    const isAdmin = membership?.isAdmin || false;

    // Count pending join requests (Creator/Admin only)
    let pendingRequestsCount = 0;
    let pendingPostsCount = 0;

    if (isCreator || isAdmin) {
      const [requestsCount, postsCount] = await Promise.all([
        RoomMembership.countDocuments({
          room: roomId,
          status: ROOM_MEMBERSHIP_STATUS.PENDING,
        }),
        Post.countDocuments({
          postOnId: roomId,
          postOnModel: POST_TARGET_MODELS.ROOM,
          status: POST_STATUS.PENDING,
          isDeleted: false,
        }),
      ]);
      pendingRequestsCount = requestsCount;
      pendingPostsCount = postsCount;
    }

    const meta = {
      isMember: membership?.status === ROOM_MEMBERSHIP_STATUS.JOINED,
      hasPendingRequest: membership?.status === ROOM_MEMBERSHIP_STATUS.PENDING,
      isRejected: membership?.status === ROOM_MEMBERSHIP_STATUS.REJECTED,
      isBanned: membership?.status === ROOM_MEMBERSHIP_STATUS.BANNED,
      isTeacher: user?.userType === "TEACHER",
      isCreator,
      isAdmin,
      isCR: membership?.isCR || false,
      isHidden: membership?.isHidden || false,
      canPost: isCreator || isAdmin || room.settings?.allowStudentPosting,
      canComment: isCreator || isAdmin || room.settings?.allowComments,
      pendingRequestsCount,
      pendingPostsCount,
      joinCode:
        membership?.status === ROOM_MEMBERSHIP_STATUS.JOINED
          ? room.joinCode
          : null, // Only show to members
    };

    return { room, meta };
  },

  // 🚀 GET ROOM PENDING REQUESTS (Creator or Admin)
  getRoomPendingRequestsService: async (
    roomId,
    userId,
    page = 1,
    limit = 10
  ) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is creator or admin
    const isCreator = room.creator.toString() === userId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(
        403,
        "Only room creator or admin can view pending requests"
      );
    }

    const skip = (page - 1) * limit;

    // Get pending memberships
    const pendingMemberships = await RoomMembership.find({
      room: roomId,
      status: ROOM_MEMBERSHIP_STATUS.PENDING,
    })
      .populate("user", "fullName userName avatar institution")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const requests = pendingMemberships.map((membership) => {
      const user = membership.user;
      return {
        user: {
          _id: user._id,
          fullName: user.fullName,
          userName: user.userName,
          avatar: user.avatar,
          institution: user.institution,
        },
        meta: {
          memberId: membership._id,
          requestedAt: membership.createdAt,
          canManage: false,
        },
      };
    });

    const totalDocs = await RoomMembership.countDocuments({
      room: roomId,
      status: ROOM_MEMBERSHIP_STATUS.PENDING,
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { requests, pagination };
  },

  // 🚀 GET ROOM PENDING POSTS
  getRoomPendingPostsService: async (roomId, userId, page = 1, limit = 10) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");
    const { POST_STATUS, POST_TARGET_MODELS } = await import(
      "../constants/index.js"
    );

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });

    if (!membership) {
      throw new ApiError(403, "You must be a member to view pending posts");
    }

    const isCreator = room.creator.toString() === userId.toString();
    const isAdmin = membership.isAdmin;

    const skip = (page - 1) * limit;

    const query = {
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
      status: POST_STATUS.PENDING,
      isDeleted: false,
    };

    // Dual view logic:
    // If not creator or admin, only show own pending posts
    if (!isCreator && !isAdmin) {
      query.author = userId;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "fullName avatar userName")
      .lean();

    const postsWithMeta = posts.map((post) => ({
      post,
      meta: {
        isLiked: false,
        isSaved: false,
        isRead: false,
        isMine: post.author._id.toString() === userId.toString(),
        canDelete:
          isCreator ||
          isAdmin ||
          post.author._id.toString() === userId.toString(),
      },
    }));

    const totalDocs = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      posts: postsWithMeta,
      pagination: {
        totalDocs,
        limit: Number(limit),
        page: Number(page),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  // 🚀 APPROVE ROOM POST
  approveRoomPostService: async (roomId, postId, adminId) => {
    const { POST_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");

    // Check if requester is creator or admin
    const isCreator = room.creator.toString() === adminId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: adminId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(403, "Only room creator or admin can approve posts");
    }

    const post = await Post.findOne({
      _id: postId,
      postOnId: roomId,
      status: POST_STATUS.PENDING,
    });

    if (!post) throw new ApiError(404, "Pending post not found");

    post.status = POST_STATUS.APPROVED;
    await post.save();

    // Increment room post count
    await Room.findByIdAndUpdate(roomId, { $inc: { postsCount: 1 } });

    return { status: POST_STATUS.APPROVED };
  },

  // 🚀 REJECT ROOM POST
  rejectRoomPostService: async (roomId, postId, adminId) => {
    const { POST_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");

    // Check if requester is creator or admin
    const isCreator = room.creator.toString() === adminId.toString();
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: adminId,
    });

    if (!isCreator && !membership?.isAdmin) {
      throw new ApiError(403, "Only room creator or admin can reject posts");
    }

    const post = await Post.findOne({
      _id: postId,
      postOnId: roomId,
      status: POST_STATUS.PENDING,
    });

    if (!post) throw new ApiError(404, "Pending post not found");

    post.status = POST_STATUS.REJECTED;
    await post.save();

    return { status: POST_STATUS.REJECTED };
  },
};

// ==========================================
// ROOM POSTS & MEMBERS
// ==========================================
const roomPostsAndMembers = {
  // 🚀 CREATE ROOM POST
  createRoomPostService: async (roomId, userId, postData) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");
    if (room.isArchived)
      throw new ApiError(403, "Cannot post in archived room");

    // Check membership - must be JOINED
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });
    if (!membership) {
      throw new ApiError(403, "You must be a member to post in this room");
    }

    const { User } = await import("../models/user.model.js");
    const user = await User.findById(userId);

    // Check if student posting is allowed
    if (
      user.userType === "STUDENT" &&
      room.settings?.allowStudentPosting === false
    ) {
      throw new ApiError(403, "Student posting is disabled in this room");
    }

    const { POST_TARGET_MODELS } = await import("../constants/index.js");
    const { createPostService } = await import("./common/post.service.js");

    // Prepare post data
    const newPostData = {
      ...postData,
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
    };

    // Create post using common service
    const formattedPost = await createPostService(newPostData, userId);

    // Update room stats
    await Room.findByIdAndUpdate(roomId, { $inc: { postsCount: 1 } });

    return formattedPost;
  },

  // 🚀 GET ROOM POSTS
  getRoomPostsService: async (roomId, userId, page = 1, limit = 10) => {
    const { ROOM_MEMBERSHIP_STATUS } = await import("../constants/index.js");

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check membership - must be JOINED
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });
    if (!membership) {
      throw new ApiError(403, "You are not a member of this room");
    }

    const { Post } = await import("../models/post.model.js");
    const { Reaction } = await import("../models/reaction.model.js");
    const { ReadPost } = await import("../models/readPost.model.js");
    const {
      REACTION_TARGET_MODELS,
      POST_TARGET_MODELS,
      POST_STATUS,
      POST_VISIBILITY,
    } = await import("../constants/index.js");

    const skip = (page - 1) * limit;

    // Filter Logic:
    // 1. Basic: Approved posts in this room, not deleted
    // 2. Visibility:
    //    - Show if visibility is NOT "ONLY_ME"
    //    - OR if visibility IS "ONLY_ME" AND author is current user
    const query = {
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
      status: POST_STATUS.APPROVED,
      isDeleted: false,
      $or: [
        { visibility: { $ne: POST_VISIBILITY.ONLY_ME } },
        { author: userId },
      ],
    };

    const posts = await Post.find(query)
      .populate("author", "fullName userName avatar")
      .populate("attachments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postIds = posts.map((p) => p._id);

    const [likes, readStatuses] = await Promise.all([
      Reaction.find({
        targetModel: REACTION_TARGET_MODELS.POST,
        targetId: { $in: postIds },
        user: userId,
      }),
      ReadPost.find({ post: { $in: postIds }, user: userId }),
    ]);

    const likeMap = new Map(likes.map((l) => [l.targetId.toString(), true]));
    const readMap = new Map(readStatuses.map((r) => [r.post.toString(), true]));

    const isCreator = room.creator.toString() === userId.toString();
    const isAdmin = membership.isAdmin;

    const postsWithMeta = posts.map((post) => ({
      post: post,
      meta: {
        isLiked: likeMap.has(post._id.toString()),
        isSaved: false, // Bookmark feature not implemented yet
        isRead: readMap.has(post._id.toString()),
        isMine: post.author._id.toString() === userId.toString(),
        canDelete:
          isCreator ||
          isAdmin ||
          post.author._id.toString() === userId.toString(),
      },
    }));

    const total = await Post.countDocuments(query);

    const pagination = {
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasNextPage: parseInt(page) < Math.ceil(total / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { posts: postsWithMeta, pagination };
  },

  // 🚀 GET ROOM MEMBERS
  getRoomMembersService: async (roomId, userId, page = 1, limit = 10) => {
    const { ROOM_MEMBERSHIP_STATUS, ROOM_ROLES } = await import(
      "../constants/index.js"
    );

    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check membership - must be JOINED
    const currentUserMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });
    if (!currentUserMembership) {
      throw new ApiError(403, "You are not a member of this room");
    }

    const isCreator = room.creator.toString() === userId.toString();
    const isAdmin = currentUserMembership.isAdmin;

    const skip = (page - 1) * limit;

    // Only show JOINED members
    const memberships = await RoomMembership.find({
      room: roomId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    })
      .populate({
        path: "user",
        select: "fullName userName avatar institution",
        populate: { path: "institution", select: "name" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const { mapUserToResponse } = await import("../utils/responseMappers.js");
    const { USER_RELATION_STATUS } = await import("../constants/index.js");
    const { FRIENDSHIP_STATUS } = await import("../constants/index.js");
    const { Friendship } = await import("../models/friendship.model.js");

    const memberUserIds = memberships
      .map((m) => m.user?._id)
      .filter((id) => id !== undefined && id !== null);

    const friendships = await Friendship.find({
      $or: [
        { requester: userId, recipient: { $in: memberUserIds } },
        { recipient: userId, requester: { $in: memberUserIds } },
      ],
    });

    const friendshipMap = new Map();
    friendships.forEach((f) => {
      const otherId =
        f.requester.toString() === userId.toString()
          ? f.recipient.toString()
          : f.requester.toString();

      let status = null;
      if (f.status === FRIENDSHIP_STATUS.ACCEPTED) {
        status = USER_RELATION_STATUS.FRIEND;
      } else if (f.status === FRIENDSHIP_STATUS.PENDING) {
        if (f.requester.toString() === userId.toString()) {
          status = USER_RELATION_STATUS.REQUEST_SENT;
        } else {
          status = USER_RELATION_STATUS.REQUEST_RECEIVED;
        }
      } else if (f.status === FRIENDSHIP_STATUS.BLOCKED) {
        if (f.requester.toString() === userId.toString()) {
          status = USER_RELATION_STATUS.BLOCKED;
        } else {
          status = USER_RELATION_STATUS.BLOCKED_BY_THEM;
        }
      }

      friendshipMap.set(otherId, status);
    });

    const members = memberships
      .map((membership) => {
        const user = membership.user;
        if (!user) return null; // Handle orphaned membership

        const userIdStr = user._id.toString();
        const isSelf = userIdStr === userId.toString();

        // Determine relation status
        let relationStatus = USER_RELATION_STATUS.NONE;

        if (isSelf) {
          relationStatus = USER_RELATION_STATUS.SELF;
        } else {
          relationStatus = friendshipMap.get(userIdStr);
        }

        const roleHierarchy = {
          [ROOM_ROLES.CREATOR]: 3,
          [ROOM_ROLES.ADMIN]: 2,
          [ROOM_ROLES.MEMBER]: 1,
        };

        const currentUserRole = isCreator
          ? ROOM_ROLES.CREATOR
          : isAdmin
            ? ROOM_ROLES.ADMIN
            : ROOM_ROLES.MEMBER;

        const currentUserLevel = roleHierarchy[currentUserRole] || 0;

        // Determine target role
        let targetRole = ROOM_ROLES.MEMBER;
        if (room.creator.toString() === userIdStr) {
          targetRole = ROOM_ROLES.CREATOR;
        } else if (membership.isAdmin) {
          targetRole = ROOM_ROLES.ADMIN;
        }

        const targetUserLevel = roleHierarchy[targetRole] || 0;

        const canManage =
          !isSelf &&
          currentUserLevel > targetUserLevel &&
          currentUserLevel >= roleHierarchy[ROOM_ROLES.ADMIN];

        // Base user response
        const mappedUser = mapUserToResponse(user, relationStatus);

        // Add Room-specific meta
        return {
          ...mappedUser,
          meta: {
            ...mappedUser.meta,
            memberId: membership._id,
            role: targetRole,
            isCR: membership.isCR,
            isAdmin: membership.isAdmin,
            isCreator: room.creator.toString() === userIdStr,
            isSelf: isSelf,
            canManage,
            joinedAt: membership.createdAt,
          },
        };
      })
      .filter(Boolean); // Filter out nulls

    const total = await RoomMembership.countDocuments({
      room: roomId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });

    const pagination = {
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasNextPage: parseInt(page) < Math.ceil(total / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    const meta = {
      currentUserRole: isCreator
        ? ROOM_ROLES.CREATOR
        : isAdmin
          ? ROOM_ROLES.ADMIN
          : ROOM_ROLES.MEMBER,
    };

    return { members, pagination, meta };
  },
};

export { roomActions, roomServices, roomPostsAndMembers };
