import { Branch } from "../models/branch.model.js";
import { BranchMembership } from "../models/branchMembership.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ReadPost } from "../models/readPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFile, deleteFile } from "../utils/cloudinaryFileUpload.js";
import { createPostService } from "./common/post.service.js";
import {
  POST_STATUS,
  POST_TARGET_MODELS,
  USER_TYPES,
  POST_VISIBILITY,
  BRANCH_TYPES,
} from "../constants/index.js";

// ==========================================
// BRANCH ACTIONS
// ==========================================
const branchActions = {
  createBranchService: async (branchData, userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Only owner can create branches
    if (user.userType !== USER_TYPES.OWNER) {
      throw new ApiError(403, "Only owner can create branches");
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
      const existing = await Branch.findOne({ joinCode });
      if (!existing) {
        isUnique = true;
      } else {
        joinCode = generateJoinCode();
      }
    }

    // Handle Sub-Branch logic
    let parentBranchId = null;
    if (branchData.branchType === BRANCH_TYPES.SUB_BRANCH) {
      if (!branchData.parentBranchJoinCode) {
        throw new ApiError(400, "Join code of the main branch is required");
      }

      const parentBranch = await Branch.findOne({
        joinCode: branchData.parentBranchJoinCode,
        isDeleted: false,
      });

      if (!parentBranch) {
        throw new ApiError(404, "Main branch with this join code not found");
      }

      parentBranchId = parentBranch._id;
    }

    // Create Branch
    const branch = await Branch.create({
      name: branchData.name,
      description: branchData.description || "No description provided.",
      coverImage:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop",
      branchType: branchData.branchType,
      parentBranch: parentBranchId,
      joinCode,
      isDeleted: false,
      membersCount: 0,
      postsCount: 0,
    });

    if (!branch) {
      throw new ApiError(500, "Failed to create branch");
    }

    // Add Creator as Member (Admin)
    await BranchMembership.create({
      branch: branch._id,
      user: userId,
      isAdmin: true,
    });

    return {};
  },

  // 🚀 JOIN BRANCH (via join code only)
  joinBranchService: async (userId, joinCode) => {
    // Find branch by join code
    const branch = await Branch.findOne({ joinCode });

    if (!branch) {
      throw new ApiError(404, "Invalid join code");
    }

    if (branch.isDeleted) {
      throw new ApiError(404, "Branch not found");
    }

    // Check if already member
    const existing = await BranchMembership.findOne({
      branch: branch._id,
      user: userId,
    });

    if (existing) {
      throw new ApiError(400, "Already a member of this branch");
    }

    // Join directly
    await BranchMembership.create({
      branch: branch._id,
      user: userId,
      isAdmin: false,
    });

    // Increment member count
    await Branch.findByIdAndUpdate(branch._id, { $inc: { membersCount: 1 } });

    return {
      branchId: branch._id,
      branchName: branch.name,
    };
  },

  // 🚀 REMOVE MEMBER (Creator or Admin)
  removeMemberService: async (branchId, creatorOrAdminId, targetUserId) => {
    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");
    if (branch.isDeleted) throw new ApiError(404, "Branch not found");

    // Check if requester is branch admin or app admin
    const requester = await User.findById(creatorOrAdminId);
    const requesterMembership = await BranchMembership.findOne({
      branch: branchId,
      user: creatorOrAdminId,
    });

    const hasPermission =
      requesterMembership?.isAdmin ||
      requester.userType === USER_TYPES.OWNER ||
      requester.userType === USER_TYPES.ADMIN;

    if (!hasPermission) {
      throw new ApiError(
        403,
        "Only branch admins or app admins can remove members"
      );
    }

    const targetMembership = await BranchMembership.findOne({
      branch: branchId,
      user: targetUserId,
    });

    if (!targetMembership) {
      throw new ApiError(404, "User is not a member of this branch");
    }

    // Cannot remove admins (only app admins can)
    if (
      targetMembership.isAdmin &&
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can remove branch admins");
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
    await BranchMembership.findByIdAndDelete(targetMembership._id);

    // Decrement member count
    await Branch.findByIdAndUpdate(branchId, { $inc: { membersCount: -1 } });

    return { branchId: branch._id, userId: targetUserId };
  },

  // 🚀 PROMOTE TO ADMIN (App Admin or Branch Admin?) - Original was app admin only
  promoteMemberService: async (branchId, adminId, targetUserId) => {
    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");
    if (branch.isDeleted) throw new ApiError(404, "Branch not found");

    // Only app admins can promote
    const requester = await User.findById(adminId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can promote members to admin");
    }

    const membership = await BranchMembership.findOne({
      branch: branchId,
      user: targetUserId,
    });

    if (!membership) {
      throw new ApiError(404, "User is not a member of this branch");
    }

    if (membership.isAdmin) {
      throw new ApiError(400, "User is already an admin");
    }

    membership.isAdmin = true;
    await membership.save();

    return { branchId: branch._id, userId: targetUserId };
  },

  // 🚀 DEMOTE ADMIN (App Admin only)
  demoteMemberService: async (branchId, adminId, targetUserId) => {
    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");
    if (branch.isDeleted) throw new ApiError(404, "Branch not found");

    // Only app admins can demote
    const requester = await User.findById(adminId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can demote admins");
    }

    const membership = await BranchMembership.findOne({
      branch: branchId,
      user: targetUserId,
    });

    if (!membership) {
      throw new ApiError(404, "User is not a member of this branch");
    }

    if (!membership.isAdmin) {
      throw new ApiError(400, "User is not an admin");
    }

    membership.isAdmin = false;
    await membership.save();

    return { branchId: branch._id, userId: targetUserId };
  },

  // 🚀 DELETE BRANCH (Creator only)
  deleteBranchService: async (branchId, userId) => {
    const branch = await Branch.findById(branchId);

    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    if (branch.isDeleted) {
      throw new ApiError(404, "Branch already deleted");
    }

    // Only app admins can delete branch
    const requester = await User.findById(userId);
    if (
      requester.userType !== USER_TYPES.OWNER &&
      requester.userType !== USER_TYPES.ADMIN
    ) {
      throw new ApiError(403, "Only app admins can delete the branch");
    }

    // 1. Soft Delete Branch
    branch.isDeleted = true;
    await branch.save();

    // 2. Delete All Memberships
    await BranchMembership.deleteMany({ branch: branchId });

    // 3. Find all posts of this branch
    const branchPosts = await Post.find({
      postOnModel: POST_TARGET_MODELS.BRANCH,
      postOnId: branchId,
      isDeleted: false,
    }).select("_id");

    const postIds = branchPosts.map((p) => p._id);

    // 4. Soft Delete All Posts
    if (postIds.length > 0) {
      await Post.updateMany({ _id: { $in: postIds } }, { isDeleted: true });
    }

    return {
      branchId: branch._id,
    };
  },

  // 🚀 UPDATE BRANCH (Creator or Admin)
  updateBranchService: async (branchId, userId, updateData) => {
    const branch = await Branch.findById(branchId);

    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    if (branch.isDeleted) {
      throw new ApiError(404, "Branch not found");
    }

    // Check if user is admin or app admin
    const user = await User.findById(userId);
    const membership = await BranchMembership.findOne({
      branch: branchId,
      user: userId,
    });

    const hasAccess =
      membership?.isAdmin ||
      user.userType === USER_TYPES.OWNER ||
      user.userType === USER_TYPES.ADMIN;

    if (!hasAccess) {
      throw new ApiError(403, "Only admins can update branch details");
    }

    // Update allowed fields
    if (updateData.name) branch.name = updateData.name;
    if (updateData.description !== undefined)
      branch.description = updateData.description;
    if (updateData.branchType) branch.branchType = updateData.branchType;

    // Privacy is removed

    await branch.save();

    return { branch };
  },

  // 🚀 UPDATE BRANCH COVER IMAGE (Creator or Admin)
  updateBranchCoverImageService: async (branchId, userId, localFilePath) => {
    if (!localFilePath) throw new ApiError(400, "Cover image missing");

    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");

    if (branch.isDeleted) {
      throw new ApiError(404, "Branch not found");
    }

    // Check if user is admin or app admin
    const user = await User.findById(userId);
    const membership = await BranchMembership.findOne({
      branch: branchId,
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
    if (branch.coverImage && branch.coverImage.includes("cloudinary")) {
      const publicId = branch.coverImage.split("/").pop().split(".")[0];
      await deleteFile(publicId);
    }

    branch.coverImage = cover.url;
    await branch.save();

    return { branch };
  },

  // 🚀 LEAVE BRANCH
  leaveBranchService: async (branchId, userId) => {
    // 1. Check if branch exists
    const branch = await Branch.findOne({ _id: branchId });

    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    if (branch.isDeleted) {
      throw new ApiError(404, "This branch has been deleted");
    }

    // 2. Check membership
    const membership = await BranchMembership.findOne({
      branch: branchId,
      user: userId,
    });

    if (!membership) {
      throw new ApiError(404, "You are not a member of this branch");
    }

    // 4. Remove membership
    await BranchMembership.findByIdAndDelete(membership._id);

    // 5. Decrement member count
    await Branch.findByIdAndUpdate(branchId, { $inc: { membersCount: -1 } });

    return { branchId: branch._id };
  },
};

// ==========================================
// BRANCH SERVICES
// ==========================================
const branchServices = {
  // 🚀 GET MY BRANCHES
  getMyBranchesService: async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // Get all branch IDs that are not deleted
    const validBranches = await Branch.find({
      isDeleted: false,
    }).distinct("_id");

    // Find memberships for valid branches only
    const memberships = await BranchMembership.find({
      user: userId,
      branch: { $in: validBranches },
    })
      .populate({
        path: "branch",
        select: "name coverImage",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const branches = memberships.map((membership) => {
      const branch = membership.branch;
      return {
        _id: branch._id,
        name: branch.name,
        coverImage: branch.coverImage,
      };
    });

    // Get total count
    const totalDocs = await BranchMembership.countDocuments({
      user: userId,
      branch: { $in: validBranches },
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { branches, pagination };
  },

  // 🚀 GET ALL BRANCHES
  getAllBranchesService: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const branches = await Branch.find({ isDeleted: false })
      .select("name coverImage membersCount postsCount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalDocs = await Branch.countDocuments({ isDeleted: false });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    };

    return { branches, pagination };
  },

  // 🚀 GET BRANCH DETAILS
  getBranchDetailsService: async (branchId, userId) => {
    const branch = await Branch.findOne({ _id: branchId, isDeleted: false });

    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    // Check membership
    const membership = await BranchMembership.findOne({
      branch: branchId,
      user: userId,
    });

    const user = await User.findById(userId);

    const isAppOwner = user.userType === USER_TYPES.OWNER;
    const isAppAdmin = user.userType === USER_TYPES.ADMIN;
    const isBranchAdmin = membership?.isAdmin || false;
    const isMember = !!membership;

    const meta = {
      isMember,
      isBranchAdmin,
      isAppOwner,
      isAppAdmin,
    };

    return { branch, meta };
  },
};

// ==========================================
// 🚀 10. GET BRANCH POSTS
// ==========================================
const getBranchPostsService = async (
  branchId,
  userId,
  page = 1,
  limit = 10
) => {
  const branch = await Branch.findOne({ _id: branchId, isDeleted: false });
  if (!branch) throw new ApiError(404, "Branch not found");

  // Check membership
  const membership = await BranchMembership.findOne({
    branch: branchId,
    user: userId,
  });

  if (!membership)
    throw new ApiError(403, "You must be a member to view posts");

  const skip = (page - 1) * limit;

  const posts = await Post.find({
    postOnModel: POST_TARGET_MODELS.BRANCH,
    postOnId: branchId,
    isDeleted: false,
  })
    .populate("author", "fullName avatar userName")
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalDocs = await Post.countDocuments({
    postOnModel: POST_TARGET_MODELS.BRANCH,
    postOnId: branchId,
    isDeleted: false,
  });

  // Formatting posts with meta
  const formattedPosts = await Promise.all(
    posts.map(async (post) => {
      const isRead = await ReadPost.exists({ post: post._id, user: userId });

      return {
        post,
        meta: {
          isRead: !!isRead,
          isMine: post.author._id.toString() === userId.toString(),
        },
      };
    })
  );

  const pagination = {
    totalDocs,
    limit: parseInt(limit),
    page: parseInt(page),
    totalPages: Math.ceil(totalDocs / limit),
    hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
    hasPrevPage: parseInt(page) > 1,
  };

  return { posts: formattedPosts, pagination };
};

// ==========================================
// 🚀 11. GET BRANCH MEMBERS
// ==========================================
const getBranchMembersService = async (
  branchId,
  userId,
  page = 1,
  limit = 10
) => {
  const branch = await Branch.findById(branchId);
  if (!branch) throw new ApiError(404, "Branch not found");

  const skip = (page - 1) * limit;

  // Check if requester is member
  const membership = await BranchMembership.findOne({
    branch: branchId,
    user: userId,
  });
  if (!membership) throw new ApiError(403, "Access denied");

  const members = await BranchMembership.find({ branch: branchId })
    .populate("user", "fullName userName avatar institution")
    .sort({ isAdmin: -1, createdAt: 1 }) // Admins first
    .skip(skip)
    .limit(Number(limit));

  const totalDocs = await BranchMembership.countDocuments({ branch: branchId });

  const formattedMembers = members.map((m) => ({
    user: m.user,
    isAdmin: m.isAdmin,
    joinedAt: m.createdAt,
  }));

  const pagination = {
    totalDocs,
    limit: parseInt(limit),
    page: parseInt(page),
    totalPages: Math.ceil(totalDocs / limit),
    hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
    hasPrevPage: parseInt(page) > 1,
  };

  return {
    members: formattedMembers,
    pagination,
    meta: { isRequesterAdmin: membership.isAdmin },
  };
};

export {
  branchActions,
  branchServices,
  getBranchPostsService,
  getBranchMembersService,
};
