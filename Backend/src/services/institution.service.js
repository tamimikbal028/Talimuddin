import { Institution } from "../models/institution.model.js";
import { Department } from "../models/department.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { POST_TARGET_MODELS, POST_STATUS } from "../constants/index.js";

const institutionServices = {
  // 🚀 1. GET INSTITUTION HEADER (Minimal data for header)
  getInstitutionHeaderService: async (instId, userId) => {
    const { Follow } = await import("../models/follow.model.js");
    const { FOLLOW_TARGET_MODELS } = await import("../constants/index.js");

    const institution = await Institution.findById(instId)
      .select("name logo coverImage website postsCount followersCount isActive")
      .lean();

    if (!institution) {
      throw new ApiError(404, "Institution not found");
    }

    if (!institution.isActive) {
      throw new ApiError(404, "Institution is inactive");
    }

    // Check if user is following
    let isFollowing = false;
    if (userId) {
      const followRecord = await Follow.findOne({
        follower: userId,
        followingModel: FOLLOW_TARGET_MODELS.INSTITUTION,
        following: instId,
      });
      isFollowing = !!followRecord;
    }

    const meta = {
      isFollowing,
    };

    return { institution, meta };
  },

  // 🚀 2. GET INSTITUTION DETAILS (Full data for about page)
  getInstitutionDetailsService: async (instId) => {
    const institution = await Institution.findById(instId);

    if (!institution) {
      throw new ApiError(404, "Institution not found");
    }

    if (!institution.isActive) {
      throw new ApiError(404, "Institution is inactive");
    }

    return { institution };
  },

  // 🚀 2. GET INSTITUTION FEED (Official updates)
  getInstitutionFeedService: async (instId, userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      postOnModel: POST_TARGET_MODELS.INSTITUTION,
      postOnId: instId,
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
      postOnModel: POST_TARGET_MODELS.INSTITUTION,
      postOnId: instId,
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

  // 🚀 3. GET DEPARTMENTS LIST
  getDepartmentsListService: async (instId) => {
    const departments = await Department.find({
      institution: instId,
      isActive: true,
    })
      .select("name code logo studentsCount")
      .sort({ name: 1 });

    return { departments };
  },
};

export { institutionServices };
