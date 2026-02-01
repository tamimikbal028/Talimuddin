import { Potrika } from "../models/potrika.model.js";
import { Post } from "../models/post.model.js";
import { ReadPost } from "../models/readPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { POST_TARGET_MODELS } from "../constants/index.js";
import mongoose from "mongoose";

/**
 * Get potrika header information
 */
const getPotrikaHeaderService = async (potrikaId) => {
  console.log("DEBUG: getPotrikaHeaderService called with ID:", potrikaId);
  if (!mongoose.Types.ObjectId.isValid(potrikaId)) {
    console.log("DEBUG: Invalid ObjectId format:", potrikaId);
    throw new ApiError(400, "Invalid Potrika ID format");
  }
  const potrika = await Potrika.findById(potrikaId).lean();
  console.log("DEBUG: Potrika found:", potrika ? potrika.name : "NULL");

  if (!potrika) {
    throw new ApiError(404, "Potrika not found");
  }

  return { potrika };
};

/**
 * Get potrika posts with pagination
 */
const getPotrikaPostsService = async (potrikaId, currentUserId, query = {}) => {
  const potrika = await Potrika.findById(potrikaId);

  if (!potrika) {
    throw new ApiError(404, "Potrika not found");
  }

  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  // Get posts for this potrika
  const posts = await Post.find({
    postOnId: potrikaId,
    postOnModel: POST_TARGET_MODELS.POTRIKA,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName userName avatar")
    .lean();

  const totalPosts = await Post.countDocuments({
    postOnId: potrikaId,
    postOnModel: POST_TARGET_MODELS.POTRIKA,
    isDeleted: false,
  });

  const totalPages = Math.ceil(totalPosts / limit);

  // Add context (isRead)
  let viewedPostIds = new Set();
  const postIds = posts.map((p) => p._id);

  if (currentUserId && posts.length > 0) {
    const viewedPosts = await ReadPost.find({
      user: currentUserId,
      post: { $in: postIds },
    }).select("post");
    viewedPostIds = new Set(viewedPosts.map((vp) => vp.post.toString()));
  }

  // Format posts with meta data
  const formattedPosts = posts.map((post) => ({
    post,
    meta: {
      isSaved: false, // TODO: Implement saved status if Saved model exists
      isMine:
        currentUserId &&
        post.author._id.toString() === currentUserId.toString(),
      isRead: viewedPostIds.has(post._id.toString()),
      isLiked: false, // TODO: Implement liked status if Reaction model exists
    },
  }));

  return {
    posts: formattedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Update potrika avatar
 */
const updatePotrikaAvatarService = async (potrikaId, avatarLocalPath) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // TODO: Upload to cloudinary
  const avatarUrl = avatarLocalPath;

  const potrika = await Potrika.findByIdAndUpdate(
    potrikaId,
    { avatar: avatarUrl },
    { new: true }
  ).lean();

  if (!potrika) {
    throw new ApiError(404, "Potrika not found");
  }

  return { potrika };
};

/**
 * Update potrika cover image
 */
const updatePotrikaCoverImageService = async (
  potrikaId,
  coverImageLocalPath
) => {
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  // TODO: Upload to cloudinary
  const coverImageUrl = coverImageLocalPath;

  const potrika = await Potrika.findByIdAndUpdate(
    potrikaId,
    { coverImage: coverImageUrl },
    { new: true }
  ).lean();

  if (!potrika) {
    throw new ApiError(404, "Potrika not found");
  }

  return { potrika };
};

/**
 * Update potrika details
 */
const updatePotrikaDetailsService = async (potrikaId, updates) => {
  const allowedUpdates = ["name", "description"];
  const filteredUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key) && updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const potrika = await Potrika.findByIdAndUpdate(potrikaId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!potrika) {
    throw new ApiError(404, "Potrika not found");
  }

  return { potrika };
};

export default {
  getPotrikaHeaderService,
  getPotrikaPostsService,
  updatePotrikaAvatarService,
  updatePotrikaCoverImageService,
  updatePotrikaDetailsService,
};
