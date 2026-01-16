import { Room } from "../models/room.model.js";
import { RoomMembership } from "../models/roomMembership.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ReadPost } from "../models/readPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFile, deleteFile } from "../utils/cloudinaryFileUpload.js";
import { createPostService } from "./common/post.service.js";
import {
  ROOM_MEMBERSHIP_STATUS,
  POST_STATUS,
  POST_TARGET_MODELS,
  USER_TYPES,
  ROOM_PRIVACY,
  POST_VISIBILITY,
  ROOM_ROLES,
  ROOM_TYPES,
} from "../constants/index.js";

// ==========================================
// ROOM ACTIONS
// ==========================================
const roomActions = {
  createRoomService: async (roomData, userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Only owner can create rooms
    if (user.userType !== USER_TYPES.OWNER) {
      throw new ApiError(403, "Only owner can create rooms");
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

    // Handle Sub-Room logic
    let parentRoomId = null;
    if (roomData.roomType === ROOM_TYPES.SUB_ROOM) {
      if (!roomData.parentRoomJoinCode) {
        throw new ApiError(400, "Join code of the main room is required");
      }

      const parentRoom = await Room.findOne({
        joinCode: roomData.parentRoomJoinCode,
        isDeleted: false,
      });

      if (!parentRoom) {
        throw new ApiError(404, "Main room with this join code not found");
      }

      parentRoomId = parentRoom._id;
    }

    // Create Room
    const room = await Room.create({
      name: roomData.name,
      description: roomData.description || "No description provided.",
      coverImage:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop",
      roomType: roomData.roomType,
      parentRoom: parentRoomId,
      joinCode,
      isDeleted: false,
      membersCount: 0,
      postsCount: 0,
    });

    if (!room) {
      throw new ApiError(500, "Failed to create room");
    }

    // Add Creator as Member with JOINED status
    await RoomMembership.create({
      room: room._id,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
      isAdmin: true,
    });

    return {};
  },

  // 🚀 JOIN ROOM (via join code only)
  joinRoomService: async (userId, joinCode) => {
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

    // Check if requester is room admin or app admin
    const requester = await User.findById(creatorOrAdminId);
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    const hasPermission =
      requesterMembership?.isAdmin ||
      requester.userType === USER_TYPES.OWNER ||
      requester.userType === USER_TYPES.ADMIN;

    if (!hasPermission) {
      throw new ApiError(
        403,
        "Only room admins or app admins can accept join requests"
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

    // Check if requester is room admin or app admin
    const requester = await User.findById(creatorOrAdminId);
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    const hasPermission =
      requesterMembership?.isAdmin ||
      requester.userType === USER_TYPES.OWNER ||
      requester.userType === USER_TYPES.ADMIN;

    if (!hasPermission) {
      throw new ApiError(
        403,
        "Only room admins or app admins can reject join requests"
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

  // 🚀 REMOVE MEMBER (Creator or Admin)
  removeMemberService: async (roomId, creatorOrAdminId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check if requester is room admin or app admin
    const requester = await User.findById(creatorOrAdminId);
    const requesterMembership = await RoomMembership.findOne({
      room: roomId,
      user: creatorOrAdminId,
    });

    const hasPermission =
      requesterMembership?.isAdmin ||
      requester.userType === USER_TYPES.OWNER ||
      requester.userType === USER_TYPES.ADMIN;

    if (!hasPermission) {
      throw new ApiError(
        403,
        "Only room admins or app admins can remove members"
      );
    }

    // Cannot remove admins (only app admins can)
    if (
      targetMembership.isAdmin &&
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can remove room admins");
    }

    const targetMembership = await RoomMembership.findOne({
      room: roomId,
      user: targetUserId,
    });

    if (!targetMembership) {
      throw new ApiError(404, "User is not a member of this room");
    }

    // Permission check for removing another admin
    if (
      targetMembership.isAdmin &&
      !requesterMembership?.isAdmin &&
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(
        403,
        "You don't have permission to remove this member"
      );
    }

    // Hard delete membership
    await RoomMembership.findByIdAndDelete(targetMembership._id);

    // Decrement member count
    await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: -1 } });

    return { roomId: room._id, userId: targetUserId };
  },

  // 🚀 PROMOTE TO ADMIN (Creator only)
  promoteMemberService: async (roomId, adminId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Only app admins can promote
    const requester = await User.findById(adminId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can promote members to admin");
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

  // 🚀 DEMOTE ADMIN (App Admin only)
  demoteMemberService: async (roomId, adminId, targetUserId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Only app admins can demote
    const requester = await User.findById(adminId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can demote admins");
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

    // Only app admins can delete room
    const requester = await User.findById(userId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can delete the room");
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

  // 🚀 UPDATE ROOM (Creator or Admin)
  updateRoomService: async (roomId, userId, updateData) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is teacher or app admin
    const user = await User.findById(userId);
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const hasAccess =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
      throw new ApiError(403, "Only admins can update room details");
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

    // Check if user is teacher or app admin
    const user = await User.findById(userId);
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const hasAccess =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
      throw new ApiError(403, "Permission denied");
    }

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

    // 3. Admin warning (Optional: could prevent last admin from leaving)
    if (membership.isAdmin) {
      // Allow leaving for now, or add specific logic for "last admin"
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
    const room = await Room.findOne({ _id: roomId, isDeleted: false });

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    // Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const user = await User.findById(userId);

    const isAdmin =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN ||
      false;

    const meta = {
      canPost: isAdmin,
      hasAccess:
        membership?.status === ROOM_MEMBERSHIP_STATUS.JOINED ||
        user.userType === USER_TYPES.OWNER ||
        user.userType === USER_TYPES.ADMIN,
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
    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is teacher or app admin
    const user = await User.findById(userId);
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const hasAccess =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
      throw new ApiError(
        403,
        "Only room teacher or app admins can view pending requests"
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

    const user = await User.findById(userId);

    const canPost =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!canPost) {
      throw new ApiError(
        403,
        "Only the room teacher or app admins can post here"
      );
    }

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

    // Check membership - must be JOINED (unless App Owner/Admin)
    const user = await User.findById(userId);
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });

    const hasAccess =
      membership ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
      throw new ApiError(403, "You are not a member of this room");
    }

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

    const [readStatuses] = await Promise.all([
      ReadPost.find({ post: { $in: postIds }, user: userId }),
    ]);

    const readMap = new Map(readStatuses.map((r) => [r.post.toString(), true]));

    const isCreator = room.creator.toString() === userId.toString();
    const isAdmin = membership.isAdmin;

    const postsWithMeta = posts.map((post) => ({
      post: post,
      meta: {
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
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check membership - must be JOINED (unless App Owner/Admin)
    const user = await User.findById(userId);
    const currentUserMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      status: ROOM_MEMBERSHIP_STATUS.JOINED,
    });

    const hasAccess =
      currentUserMembership ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
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

    const memberUserIds = memberships
      .map((m) => m.user?._id)
      .filter((id) => id !== undefined && id !== null);

    const members = memberships
      .map((membership) => {
        const user = membership.user;
        if (!user) return null; // Handle orphaned membership

        const userIdStr = user._id.toString();

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
        const mappedUser = (user) => {
          if (!user) return null;
          return {
            user: {
              _id: user._id,
              userName: user.userName,
              fullName: user.fullName,
              avatar: user.avatar,
            },
          };
        };

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
