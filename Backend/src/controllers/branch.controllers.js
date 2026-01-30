import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  branchActions,
  branchServices,
  getBranchPostsService,
  getBranchMembersService,
} from "../services/branch.service.js";

// ==========================================
// 🚀 1. CREATE BRANCH
// ==========================================
const createBranch = asyncHandler(async (req, res) => {
  const branch = await branchActions.createBranchService(
    req.body,
    req.user._id
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { branch }, "Branch created successfully"));
});

// ==========================================
// 🚀 2. GET MY BRANCHES
// ==========================================
const getMyBranches = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { branches, pagination } = await branchServices.getMyBranchesService(
    req.user._id,
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branches, pagination },
        "My branches fetched successfully"
      )
    );
});

// ==========================================
// 🚀 2.1. GET ALL BRANCHES
// ==========================================
const getAllBranches = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { branches, pagination } = await branchServices.getAllBranchesService(
    page,
    limit
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branches, pagination },
        "All branches fetched successfully"
      )
    );
});

// ==========================================
// 🚀 3. GET BRANCH DETAILS
// ==========================================
const getBranchDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { branch, meta } = await branchServices.getBranchDetailsService(
    branchId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branch, meta },
        "Branch details fetched successfully"
      )
    );
});

// ==========================================
// 🚀 4. JOIN BRANCH (by join code only)
// ==========================================
const joinBranch = asyncHandler(async (req, res) => {
  const { joinCode } = req.body;

  if (!joinCode) {
    throw new ApiError(400, "Join code is required");
  }

  const { branchId, branchName } = await branchActions.joinBranchService(
    req.user._id,
    joinCode
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branchId, branchName },
        "Joined branch successfully"
      )
    );
});

// ==========================================
// 🚀 6. DELETE BRANCH (Creator only)
// ==========================================
const deleteBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  const { branchId: id } = await branchActions.deleteBranchService(
    branchId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { branchId: id }, "Branch deleted successfully")
    );
});

// ==========================================
// 🚀 8. UPDATE BRANCH (Creator or Admin)
// ==========================================
const updateBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  const { branch } = await branchActions.updateBranchService(
    branchId,
    req.user._id,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { branch }, "Branch updated successfully"));
});

// ==========================================
// 🚀 9. UPDATE BRANCH COVER IMAGE (Creator or Admin)
// ==========================================
const updateBranchCoverImage = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }

  const { branch } = await branchActions.updateBranchCoverImageService(
    branchId,
    req.user._id,
    coverImageLocalPath
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branch },
        "Branch cover image updated successfully"
      )
    );
});

// ==========================================
// 🚀 10. GET BRANCH POSTS
// ==========================================
const getBranchPosts = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { page, limit } = req.query;

  const { posts, pagination } = await getBranchPostsService(
    branchId,
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
        "Branch posts fetched successfully"
      )
    );
});

// ==========================================
// 🚀 11. GET BRANCH MEMBERS
// ==========================================
const getBranchMembers = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { page, limit } = req.query;

  const { members, pagination, meta } = await getBranchMembersService(
    branchId,
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
        "Branch members fetched successfully"
      )
    );
});

// ==========================================
// 🚀 LEAVE BRANCH
// ==========================================
const leaveBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  const { branchId: leftBranchId } = await branchActions.leaveBranchService(
    branchId,
    req.user._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branchId: leftBranchId },
        "Left branch successfully"
      )
    );
});

// ==========================================
// 🚀 15. REMOVE MEMBER
// ==========================================
const removeMember = asyncHandler(async (req, res) => {
  const { branchId, userId } = req.params;

  const { branchId: id, userId: removedUserId } =
    await branchActions.removeMemberService(branchId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branchId: id, userId: removedUserId },
        "Member removed successfully"
      )
    );
});

// ==========================================
// 🚀 16. PROMOTE TO ADMIN
// ==========================================
const promoteMember = asyncHandler(async (req, res) => {
  const { branchId, userId } = req.params;

  const { branchId: id, userId: promotedUserId } =
    await branchActions.promoteMemberService(branchId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branchId: id, userId: promotedUserId },
        "Member promoted to admin successfully"
      )
    );
});

// ==========================================
// 🚀 17. DEMOTE TO MEMBER
// ==========================================
const demoteMember = asyncHandler(async (req, res) => {
  const { branchId, userId } = req.params;

  const { branchId: id, userId: demotedUserId } =
    await branchActions.demoteMemberService(branchId, req.user._id, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { branchId: id, userId: demotedUserId },
        "Admin demoted to member successfully"
      )
    );
});

export {
  createBranch,
  getMyBranches,
  getAllBranches,
  getBranchDetails,
  joinBranch,
  removeMember,
  promoteMember,
  demoteMember,
  deleteBranch,
  updateBranch,
  updateBranchCoverImage,
  getBranchPosts,
  getBranchMembers,
  leaveBranch,
};
