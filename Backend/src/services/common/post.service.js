import { Post } from "../../models/post.model.js";
import { ReadPost } from "../../models/readPost.model.js";
import { User } from "../../models/user.model.js";
import { POST_TARGET_MODELS, POST_VISIBILITY } from "../../constants/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { Branch } from "../../models/branch.model.js";
import { BranchMembership } from "../../models/branchMembership.model.js";
import { Potrika } from "../../models/potrika.model.js";

export const createPostService = async (postData, authorId) => {
  const {
    title,
    content,
    attachments,
    postOnModel,
    postOnId,
    visibility,
    tags,
  } = postData;

  if (!content || !postOnModel || !postOnId) {
    throw new ApiError(400, "All fields are required");
  }

  if (!Object.values(POST_TARGET_MODELS).includes(postOnModel)) {
    throw new ApiError(400, "Invalid target model");
  }

  // Validate visibility based on model
  if (postOnModel === POST_TARGET_MODELS.USER) {
    // Profiling might allow Public/Connections/OnlyMe (Internal removed)
  } else if (postOnModel === POST_TARGET_MODELS.BRANCH) {
    if (
      visibility !== POST_VISIBILITY.CONNECTIONS &&
      visibility !== POST_VISIBILITY.ONLY_ME
    ) {
      throw new ApiError(
        400,
        `Only "Branch Members" (CONNECTIONS) and "Only me" (ONLY_ME) visibility are allowed for Branch posts`
      );
    }
  }

  // Create post
  const post = await Post.create({
    title: title || "",
    content,
    attachments: attachments || [],
    postOnModel,
    postOnId,
    author: authorId,
    visibility: visibility || POST_VISIBILITY.PUBLIC,
    tags: tags || [],
    isPinned: false,
    isDeleted: false,
  });

  // Increment post count
  switch (postOnModel) {
    case POST_TARGET_MODELS.USER:
      await User.findByIdAndUpdate(postOnId, { $inc: { postsCount: 1 } });
      break;
    case POST_TARGET_MODELS.BRANCH:
      await Branch.findByIdAndUpdate(postOnId, { $inc: { postsCount: 1 } });
      break;
    case POST_TARGET_MODELS.POTRIKA:
      await Potrika.findByIdAndUpdate(postOnId, { $inc: { postsCount: 1 } });
      break;
    default:
      break;
  }

  // Populate author details
  const populatedPost = await Post.findById(post._id).populate(
    "author",
    "fullName avatar userName"
  );

  // Mark as read for author
  await ReadPost.create({
    post: post._id,
    user: authorId,
  });

  // Format response
  const formattedPost = {
    post: populatedPost,
    meta: {
      isLiked: false,
      isSaved: false,
      isMine: true,
      isRead: true,
    },
  };

  return formattedPost;
};

// === Toggle Like Service ===
export const toggleLikePostService = async (postId, userId) => {
  if (!postId) throw new ApiError(400, "Post ID is required to toggle like");

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, `Post with ID ${postId} not found`);
  }
  if (post.isDeleted) {
    throw new ApiError(410, "Cannot like a deleted post");
  }

  // Check if already liked
  const existingReaction = await Reaction.findOne({
    targetId: postId,
    targetModel: REACTION_TARGET_MODELS.POST,
    user: userId,
  });

  let isLiked = false;

  if (existingReaction) {
    // Unlike
    const deletedReaction = await Reaction.findByIdAndDelete(
      existingReaction._id
    );
    if (!deletedReaction) {
      throw new ApiError(500, "Failed to unlike the post. Please try again.");
    }
    isLiked = false;
  } else {
    // Like
    const newReaction = await Reaction.create({
      targetId: postId,
      targetModel: REACTION_TARGET_MODELS.POST,
      user: userId,
    });
    if (!newReaction) {
      throw new ApiError(500, "Failed to like the post. Please try again.");
    }
    isLiked = true;
  }

  // Get updated stats
  const updatedPost = await Post.findById(postId).select("likesCount");
  if (!updatedPost) {
    throw new ApiError(404, "Post was removed during the operation");
  }

  return {
    postId,
    isLiked,
    likesCount: updatedPost.likesCount,
  };
};

// === Toggle Mark as Read Service ===
export const toggleMarkAsReadService = async (postId, userId) => {
  if (!postId)
    throw new ApiError(400, "Post ID is required to toggle read status");

  const post = await Post.exists({ _id: postId, isDeleted: false });
  if (!post) {
    throw new ApiError(404, "Post not found or has been deleted");
  }

  // Check if already read
  const existingRead = await ReadPost.findOne({
    post: postId,
    user: userId,
  });

  if (existingRead) {
    // Mark as unread
    const deletedRead = await existingRead.deleteOne();
    if (!deletedRead) {
      throw new ApiError(500, "Failed to mark post as unread");
    }
    return {
      targetId: postId,
      isRead: false,
    };
  } else {
    // Mark as read
    const newRead = await ReadPost.create({
      post: postId,
      user: userId,
    });
    if (!newRead) {
      throw new ApiError(500, "Failed to mark post as read");
    }
    return {
      targetId: postId,
      isRead: true,
    };
  }
};

// === Delete Post Service ===
export const deletePostService = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, `Post not found with ID: ${postId}`);
  }
  if (post.isDeleted) {
    throw new ApiError(410, "Post has already been deleted.");
  }

  // Check authorization
  const isAuthor = post.author.toString() === userId.toString();

  // Allow delete if user is author
  if (!isAuthor) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // 4. Update postsCount for the target model
  if (post.postOnId) {
    try {
      switch (post.postOnModel) {
        case POST_TARGET_MODELS.USER:
          await User.findByIdAndUpdate(post.postOnId, {
            $inc: { postsCount: -1 },
          });
          break;
        case POST_TARGET_MODELS.BRANCH:
          await Branch.findByIdAndUpdate(post.postOnId, {
            $inc: { postsCount: -1 },
          });
          break;
        case POST_TARGET_MODELS.POTRIKA:
          await Potrika.findByIdAndUpdate(post.postOnId, {
            $inc: { postsCount: -1 },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Failed to update postsCount for the target model"
      );
    }
  }

  // Soft delete post
  post.isDeleted = true;
  await post.save();

  return { postId };
};

// === Update Post Service ===
export const updatePostService = async (postId, userId, updateData) => {
  const { title, content, visibility, tags, attachments } = updateData;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, `Post not found with ID: ${postId}`);
  }

  // Check authorization
  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  if (post.isDeleted) {
    throw new ApiError(
      410,
      "This post has been deleted and cannot be updated."
    );
  }

  // Update fields
  let isContentChanged = false;

  if (title !== undefined && title !== post.title) {
    post.title = title;
    isContentChanged = true;
  }
  if (content !== undefined && content !== post.content) {
    post.content = content;
    isContentChanged = true;
  }
  if (visibility !== undefined && visibility !== post.visibility) {
    post.visibility = visibility;
    // Visibility change shouldn't mark post as edited
  }
  if (
    tags !== undefined &&
    JSON.stringify(tags) !== JSON.stringify(post.tags)
  ) {
    post.tags = tags;
    // Tags change shouldn't mark post as edited
  }

  if (attachments) {
    post.attachments = attachments;
    isContentChanged = true;
  }

  if (isContentChanged) {
    post.isEdited = true;
    post.editedAt = new Date();
  }

  await post.save();

  // Return updated post with author details
  const updatedPostObj = await Post.findById(postId).populate(
    "author",
    "fullName avatar userName"
  );

  if (!updatedPostObj) {
    throw new ApiError(404, "Post was lost during update operation");
  }

  return {
    post: updatedPostObj,
    meta: {
      isSaved: false,
      isMine: true,
      isRead: true,
    },
  };
};

// === Toggle Pin Post Service (Group only, Admin/Owner only) ===
export const togglePinPostService = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, `Post not found for pinning (ID: ${postId})`);
  }

  if (post.isDeleted) {
    throw new ApiError(410, "Cannot pin a deleted post.");
  }

  // Only branch posts can be pinned in this implementation (or user profile)
  if (
    post.postOnModel !== POST_TARGET_MODELS.BRANCH &&
    post.postOnModel !== POST_TARGET_MODELS.USER
  ) {
    throw new ApiError(
      400,
      "Pinning is only supported for branch or user posts"
    );
  }

  // Check authorization based on model
  if (post.postOnModel === POST_TARGET_MODELS.BRANCH) {
    const membership = await BranchMembership.findOne({
      branch: post.postOnId,
      user: userId,
      isAdmin: true,
    });
    if (!membership) {
      throw new ApiError(
        403,
        "You are not authorized to pin/unpin posts in this branch"
      );
    }
  } else if (post.postOnModel === POST_TARGET_MODELS.USER) {
    // Only profile owner can pin their own posts
    if (post.postOnId.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only pin posts on your own profile");
    }
  }

  // Toggle pinned flag
  post.isPinned = !post.isPinned;
  const savedPost = await post.save();
  if (!savedPost) {
    throw new ApiError(500, "Failed to save the pinned status");
  }

  // Return updated post with author populated and minimal meta
  const updatedPostObj = await Post.findById(postId).populate(
    "author",
    "fullName avatar userName"
  );

  // Check like status
  const existingReaction = await Reaction.findOne({
    targetId: postId,
    targetModel: REACTION_TARGET_MODELS.POST,
    user: userId,
  });

  return {
    post: updatedPostObj,
    meta: {
      isLiked: !!existingReaction,
      isSaved: false,
      isMine: post.author.toString() === userId.toString(),
      isRead: false,
    },
  };
};
