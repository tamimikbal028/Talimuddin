import { Department } from "../models/department.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { POST_TARGET_MODELS, POST_STATUS } from "../constants/index.js";

const departmentServices = {
  // 🚀 1. GET DEPARTMENT HEADER (Minimal data for header)
  getDepartmentHeaderService: async (deptId, userId) => {
    const { Follow } = await import("../models/follow.model.js");
    const { FOLLOW_TARGET_MODELS } = await import("../constants/index.js");

    const department = await Department.findById(deptId)
      .select(
        "name code logo coverImage postsCount followersCount isActive institution"
      )
      .populate("institution", "name")
      .lean();

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    if (!department.isActive) {
      throw new ApiError(404, "Department is inactive");
    }

    // Check if user is following
    let isFollowing = false;
    if (userId) {
      const followRecord = await Follow.findOne({
        follower: userId,
        followingModel: FOLLOW_TARGET_MODELS.DEPARTMENT,
        following: deptId,
      });
      isFollowing = !!followRecord;
    }

    const meta = {
      isFollowing,
    };

    return { department, meta };
  },

  // 🚀 2. GET DEPARTMENT DETAILS (Full data for about page)
  getDepartmentDetailsService: async (deptId) => {
    const department = await Department.findById(deptId).populate(
      "institution",
      "name logo"
    );

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    if (!department.isActive) {
      throw new ApiError(404, "Department is inactive");
    }

    return { department };
  },

  // 🚀 3. GET DEPARTMENT FEED (Official updates)
  getDepartmentFeedService: async (deptId, userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      postOnModel: POST_TARGET_MODELS.DEPARTMENT,
      postOnId: deptId,
      status: POST_STATUS.APPROVED,
      isDeleted: false,
    })
      .populate("author", "fullName userName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add meta information for each post
    const { Reaction } = await import("../models/reaction.model.js");
    const { REACTION_TARGET_MODELS } = await import("../constants/index.js");

    let likedPostIds = new Set();
    const postIds = posts.map((p) => p._id);

    if (userId && posts.length > 0) {
      const likedPosts = await Reaction.find({
        user: userId,
        targetModel: REACTION_TARGET_MODELS.POST,
        targetId: { $in: postIds },
      }).select("targetId");
      likedPostIds = new Set(likedPosts.map((r) => r.targetId.toString()));
    }

    const postsWithContext = posts.map((post) => {
      const isMine = post.author._id.toString() === (userId || "").toString();

      return {
        post,
        meta: {
          isLiked: likedPostIds.has(post._id.toString()),
          isSaved: false,
          isMine,
          isRead: false,
          canDelete: isMine,
        },
      };
    });

    const totalDocs = await Post.countDocuments({
      postOnModel: POST_TARGET_MODELS.DEPARTMENT,
      postOnId: deptId,
      status: POST_STATUS.APPROVED,
      isDeleted: false,
    });

    const pagination = {
      totalDocs,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
    };

    return { posts: postsWithContext, pagination };
  },
};

export { departmentServices };
