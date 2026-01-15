import { Room } from "../models/room.model.js";
import { RoomMembership } from "../models/roomMembership.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ReadPost } from "../models/readPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { USER_TYPES, POST_TARGET_MODELS } from "../constants/index.js";
import { uploadFile, deleteFile } from "../utils/cloudinaryFileUpload.js";
import { createPostService } from "./common/post.service.js";

// ==========================================
// ROOM ACTIONS
// ==========================================
const roomActions = {
  // 🚀 CREATE ROOM (Owner only)
  createRoomService: async (roomData, userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ApiError(403, "Only admin can create rooms");
    }

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
      description: roomData.description || "No description provided",
      roomType: roomData.roomType,
      coverImage:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&h=400&fit=crop",
      creator: userId,
      joinCode,
      isDeleted: false,
      membersCount: 0,
      postsCount: 0,
      settings: {
        allowStudentPosting: roomData.allowStudentPosting,
        allowComments: roomData.allowComments,
      },
    });

    if (!room) {
      throw new ApiError(500, "Failed to create room");
    }

    return { roomId: room._id, roomName: room.name };
  },

  // 🚀 JOIN ROOM (via join code only) - Creates PENDING request
  // User can only be in ONE room at a time
  joinRoomService: async (userId, joinCode) => {
    // Find room by join code
    const room = await Room.findOne({ joinCode });

    if (!room) {
      throw new ApiError(404, "Invalid join code");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check if user is already in ANY room (accepted or pending)
    const existingMembership = await RoomMembership.findOne({
      user: userId,
    });

    if (existingMembership) {
      const existingRoom = await Room.findById(existingMembership.room);
      throw new ApiError(
        400,
        `You are already ${existingMembership.isPending ? "requesting to join" : "a member of"} "${existingRoom?.name}". Please leave that room first.`
      );
    }

    // Create PENDING membership request
    await RoomMembership.create({
      room: room._id,
      user: userId,
      isPending: true,
      room: room._id,
      user: userId,
      isPending: true,
    });

    return {
      roomId: room._id,
      roomName: room.name,
      message: "Join request sent successfully. Waiting for approval.",
    };
  },

  // 🚀 LEAVE ROOM - Deletes membership document
  leaveRoomService: async (roomId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Find membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!membership) {
      throw new ApiError(400, "You are not a member of this room");
    }

    // Delete membership document
    await RoomMembership.findByIdAndDelete(membership._id);

    // Decrement members count only if was accepted member
    if (!membership.isPending) {
      await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: -1 } });
    }

    return {
      roomId: room._id,
      message: "Successfully left the room",
    };
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

    // Only Owner or Admin can delete
    const user = await User.findById(userId);
    const isAdmin = user?.userType === USER_TYPES.ADMIN;

    if (!isAdmin) {
      throw new ApiError(403, "Only admin can delete room");
    }

    room.isDeleted = true;
    await room.save();

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

    // Check if user is admin (global or room) or owner
    const user = await User.findById(userId);
    const isGlobalAdmin = user?.userType === USER_TYPES.ADMIN;

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isGlobalAdmin && !membership?.isTeacher) {
      throw new ApiError(403, "Only admin or teacher can update room details");
    }

    // Update allowed fields
    if (updateData.name) room.name = updateData.name;
    if (updateData.description !== undefined)
      room.description = updateData.description;
    if (updateData.roomType) room.roomType = updateData.roomType;
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

    // Check if user is admin (global or room) or owner
    const user = await User.findById(userId);
    const isGlobalAdmin = user?.userType === USER_TYPES.ADMIN;

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    if (!isGlobalAdmin && !membership?.isTeacher) {
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

  // 🚀 ACCEPT JOIN REQUEST (Teacher/Admin/Owner)
  acceptJoinRequestService: async (roomId, membershipId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Get current user info
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new ApiError(404, "User not found");

    // Check if user has permission: OWNER, ADMIN, or TEACHER (who is member)
    const isGlobalAdmin = currentUser.userType === USER_TYPES.ADMIN; // Renamed to clarify global role

    const userMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      isPending: false,
    });

    const isTeacher = userMembership?.isTeacher || false;

    if (!isGlobalAdmin && !isTeacher) {
      throw new ApiError(
        403,
        "Only teachers or admins can accept join requests"
      );
    }

    // Find the pending membership
    const membership = await RoomMembership.findById(membershipId);
    if (!membership) {
      throw new ApiError(404, "Join request not found");
    }

    if (membership.room.toString() !== roomId.toString()) {
      throw new ApiError(400, "Invalid request");
    }

    if (!membership.isPending) {
      throw new ApiError(400, "This request has already been accepted");
    }

    // Accept the request
    membership.isPending = false;
    await membership.save();

    // Increment members count
    await Room.findByIdAndUpdate(roomId, { $inc: { membersCount: 1 } });

    return {
      membershipId: membership._id,
      message: "Join request accepted successfully",
    };
  },

  // 🚀 REJECT JOIN REQUEST (Teacher/Admin/Owner) - Deletes the request
  rejectJoinRequestService: async (roomId, membershipId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Get current user info
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new ApiError(404, "User not found");

    // Check if user has permission: OWNER, ADMIN, or TEACHER (who is member)
    const isGlobalAdmin = currentUser.userType === USER_TYPES.ADMIN;

    const userMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      isPending: false,
    });

    const isTeacher = userMembership?.isTeacher || false;

    if (!isGlobalAdmin && !isTeacher) {
      throw new ApiError(
        403,
        "Only teachers or admins can reject join requests"
      );
    }

    // Find the pending membership
    const membership = await RoomMembership.findById(membershipId);
    if (!membership) {
      throw new ApiError(404, "Join request not found");
    }

    if (membership.room.toString() !== roomId.toString()) {
      throw new ApiError(400, "Invalid request");
    }

    if (!membership.isPending) {
      throw new ApiError(400, "This request has already been accepted");
    }

    // Delete the request
    await RoomMembership.findByIdAndDelete(membershipId);

    return {
      membershipId,
      message: "Join request rejected",
    };
  },
};

// ==========================================
// ROOM SERVICES
// ==========================================
const roomServices = {
  // 🚀 GET ALL ROOMS (Public - anyone can see)
  getAllRoomsService: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const rooms = await Room.find({
      isDeleted: false,
    })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const formattedRooms = rooms.map((room) => ({
      _id: room._id,
      name: room.name,
      coverImage: room.coverImage,
    }));

    const totalDocs = await Room.countDocuments({
      isDeleted: false,
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { rooms: formattedRooms, pagination };
  },

  // 🚀 GET MY ROOMS (User's joined rooms only)
  getMyRoomsService: async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // Get all room IDs that are not deleted
    const validRooms = await Room.find({
      isDeleted: false,
    }).distinct("_id");

    // Find memberships for valid rooms only
    const memberships = await RoomMembership.find({
      user: userId,
      isPending: false,
      room: { $in: validRooms },
    })
      .populate("room")
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
      isPending: false,
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
    const room = await Room.findById(roomId).populate(
      "creator",
      "fullName userName avatar"
    );

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    if (room.isDeleted) {
      throw new ApiError(404, "Room not found");
    }

    // Check membership or Access Rights
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const user = await User.findById(userId);
    const isAdmin = user?.userType === USER_TYPES.ADMIN;
    const isTeacher = membership?.isTeacher || false;
    const isCreator = room.creator._id.toString() === userId.toString();

    const meta = {
      isMember: !!membership,
      isAdmin,
      isTeacher,
      isCreator,
      canJoin: !isAdmin && !membership, // Admins don't need to join, but teachers are members so !membership handles them
      canCreate: isAdmin,
    };

    return { room, meta };
  },
};

// ==========================================
// ROOM POSTS & MEMBERS
// ==========================================
const roomPostsAndMembers = {
  // 🚀 CREATE ROOM POST
  createRoomPostService: async (roomId, userId, postData) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    const user = await User.findById(userId);
    const isAdmin = user?.userType === USER_TYPES.ADMIN;

    // Check membership
    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const isTeacher = membership?.isTeacher || false;

    // Allow if Admin OR Member (Teacher is a member)
    if (!membership && !isAdmin) {
      throw new ApiError(403, "You must be a member to post in this room");
    }

    // Check if student posting is allowed
    if (
      user.userType === "STUDENT" &&
      room.settings?.allowStudentPosting === false
    ) {
      throw new ApiError(403, "Student posting is disabled in this room");
    }

    // Prepare post data
    const newPostData = {
      ...postData,
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
    };

    // Create post using common service (handles postsCount increment)
    const formattedPost = await createPostService(newPostData, userId);

    return formattedPost;
  },

  // 🚀 GET ROOM POSTS
  getRoomPostsService: async (roomId, userId, page = 1, limit = 10) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    // Check membership or Access Rights
    const user = await User.findById(userId);
    const isAdmin = user?.userType === USER_TYPES.ADMIN;

    const membership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const isTeacher = membership?.isTeacher || false;

    if (!membership && !isAdmin) {
      throw new ApiError(403, "You are not a member of this room");
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find({
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
      isDeleted: false,
    })
      .populate("author", "fullName userName avatar")
      .populate("attachments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postIds = posts.map((p) => p._id);

    const readStatuses = await ReadPost.find({
      post: { $in: postIds },
      user: userId,
    });

    const readMap = new Map(readStatuses.map((r) => [r.post.toString(), true]));

    const postsWithMeta = posts.map((post) => ({
      post: post,
      meta: {
        // ... existing meta
        isSaved: false,
        isRead: readMap.has(post._id.toString()),
        isMine: post.author._id.toString() === userId.toString(),
        canDelete:
          isAdmin || // Global Admin
          isTeacher || // Teacher of this room
          post.author._id.toString() === userId.toString(), // Post Author
      },
    }));

    const total = await Post.countDocuments({
      postOnModel: POST_TARGET_MODELS.ROOM,
      postOnId: roomId,
      isDeleted: false,
    });

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

    // Check membership or Access Rights
    const user = await User.findById(userId);
    const isAdmin = user?.userType === USER_TYPES.ADMIN;

    const currentUserMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
    });

    const isTeacher = currentUserMembership?.isTeacher || false;

    if (!currentUserMembership && !isAdmin) {
      throw new ApiError(403, "You are not a member of this room");
    }

    const skip = (page - 1) * limit;

    const memberships = await RoomMembership.find({ room: roomId })
      .populate("user", "fullName userName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const isCreator = room.creator.toString() === userId.toString();

    const members = memberships.map((membership) => {
      const user = membership.user;
      const userIdStr = user._id.toString();
      const isSelf = userIdStr === userId.toString();

      // Determine role
      let role = "MEMBER";
      if (room.creator.toString() === userIdStr) {
        role = "CREATOR";
      } else if (membership.isTeacher) {
        role = "TEACHER";
      }

      return {
        user: {
          _id: user._id,
          fullName: user.fullName,
          userName: user.userName,
          avatar: user.avatar,
        },
        meta: {
          memberId: membership._id,
          role,
          isSelf,
          isTeacher: membership.isTeacher,
          isCreator: room.creator.toString() === userIdStr,
        },
      };
    });

    const total = await RoomMembership.countDocuments({ room: roomId });

    const pagination = {
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasNextPage: parseInt(page) < Math.ceil(total / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    const meta = {
      currentUserRole: isCreator ? "CREATOR" : isAdmin ? "ADMIN" : "MEMBER",
    };

    return { members, pagination, meta };
  },

  // 🚀 GET PENDING JOIN REQUESTS (Creator or Admin only)
  getPendingJoinRequestsService: async (
    roomId,
    userId,
    page = 1,
    limit = 10
  ) => {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isDeleted) throw new ApiError(404, "Room not found");

    const currentUser = await User.findById(userId);
    if (!currentUser) throw new ApiError(404, "User not found");

    const isGlobalAdmin = currentUser.userType === USER_TYPES.ADMIN;

    const userMembership = await RoomMembership.findOne({
      room: roomId,
      user: userId,
      isPending: false,
    });

    const isTeacher = userMembership?.isTeacher || false;

    if (!isGlobalAdmin && !isTeacher) {
      throw new ApiError(403, "Only teachers or admins can view join requests");
    }

    const skip = (page - 1) * limit;

    const requests = await RoomMembership.find({
      room: roomId,
      isPending: true,
    })
      .populate("user", "fullName userName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const formattedRequests = requests.map((request) => ({
      _id: request._id,
      user: {
        _id: request.user._id,
        fullName: request.user.fullName,
        userName: request.user.userName,
        avatar: request.user.avatar,
      },
      requestedAt: request.createdAt,
    }));

    const total = await RoomMembership.countDocuments({
      room: roomId,
      isPending: true,
    });

    const pagination = {
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasNextPage: parseInt(page) < Math.ceil(total / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { requests: formattedRequests, pagination };
  },
};

export { roomActions, roomServices, roomPostsAndMembers };
