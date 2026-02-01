import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ReadPost } from "../models/readPost.model.js";
import { uploadFile, deleteFile } from "../utils/cloudinaryFileUpload.js";
import { POST_TARGET_MODELS, POST_VISIBILITY } from "../constants/index.js";
import { ApiError } from "../utils/ApiError.js";

// === Get User Profile Posts Service ===
const getUserProfilePostsService = async (
  username,
  currentUserId,
  queryParams
) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 10;
  const skip = (page - 1) * limit;

  // Find target user
  const targetUser = await User.findOne({ userName: username }).select("_id");
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  const isOwnProfile = currentUserId?.toString() === targetUser._id.toString();

  // Build query - only show PUBLIC posts
  let postQuery = {
    postOnId: targetUser._id,
    postOnModel: POST_TARGET_MODELS.USER,
    visibility: POST_VISIBILITY.PUBLIC,
    isDeleted: false,
  };

  // Fetch posts with pagination
  const posts = await Post.find(postQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName avatar userName")
    .lean();

  // Add context (isSaved, isRead)
  let viewedPostIds = new Set();
  const postIds = posts.map((p) => p._id);

  if (currentUserId && posts.length > 0) {
    // Fetch read status
    const viewedPosts = await ReadPost.find({
      user: currentUserId,
      post: { $in: postIds },
    }).select("post");

    viewedPostIds = new Set(viewedPosts.map((vp) => vp.post.toString()));
  }

  // Format posts with context
  const postsWithContext = posts.map((post) => ({
    post,
    meta: {
      isSaved: false,
      isMine: isOwnProfile,
      isRead: viewedPostIds.has(post._id.toString()),
    },
  }));

  // Count total documents for pagination
  const totalDocs = await Post.countDocuments(postQuery);
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    posts: postsWithContext,
    pagination: {
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

// ==========================================
// 🚀 8. UPDATE AVATAR SERVICE
// ==========================================
const updateUserAvatarService = async (userId, avatarLocalPath) => {
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Get user to check old avatar
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const avatar = await uploadFile(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error uploading avatar");
  }

  // Delete old avatar from Cloudinary if exists
  if (existingUser.avatar && existingUser.avatar.includes("cloudinary")) {
    const publicId = existingUser.avatar.split("/").pop().split(".")[0];
    await deleteFile(publicId);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return { user };
};

// ==========================================
// 🚀 9. UPDATE COVER IMAGE SERVICE
// ==========================================
const updateUserCoverImageService = async (userId, coverImageLocalPath) => {
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  // Get user to check old cover image
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const coverImage = await uploadFile(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(500, "Error uploading cover image");
  }

  // Delete old cover image from Cloudinary if exists
  if (
    existingUser.coverImage &&
    existingUser.coverImage.includes("cloudinary")
  ) {
    const publicId = existingUser.coverImage.split("/").pop().split(".")[0];
    await deleteFile(publicId);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  return { user };
};

// ==========================================
// 🚀 10. UPDATE ACCOUNT DETAILS SERVICE
// ==========================================
const updateAccountDetailsService = async (userId, updateData) => {
  if (updateData.userName) {
    throw new ApiError(400, "Username cannot be changed.");
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  )
    .populate("institution", "name code logo")
    .populate("academicInfo.department", "name code logo")
    .select("-password -refreshToken");

  return { user };
};

// ==========================================
// 🚀 11. GET USER PROFILE HEADER SERVICE
// ==========================================
const getUserProfileHeaderService = async (targetUsername, currentUserId) => {
  if (!targetUsername) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ userName: targetUsername }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isOwnProfile =
    currentUserId && currentUserId.toString() === user._id.toString();

  return {
    user,
    meta: {
      isOwnProfile,
    },
  };
};

const profileServices = {
  getUserProfilePostsService,
  updateUserAvatarService,
  updateUserCoverImageService,
  updateAccountDetailsService,
  getUserProfileHeaderService,
};

export default profileServices;
