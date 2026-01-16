import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { POST_TARGET_MODELS, POST_TYPES } from "../constants/index.js";
import { createPostService } from "../services/common/post.service.js";
import { departmentServices } from "../services/department.service.js";

// 🎓 GET DEPARTMENT HEADER
const getDepartmentHeader = asyncHandler(async (req, res) => {
  const { deptId } = req.params;
  const userId = req.user?._id;

  const { department, meta } =
    await departmentServices.getDepartmentHeaderService(deptId, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { department, meta }, "Department header fetched")
    );
});

// 🎓 GET DEPARTMENT DETAILS
const getDepartmentDetails = asyncHandler(async (req, res) => {
  const { deptId } = req.params;

  const { department } =
    await departmentServices.getDepartmentDetailsService(deptId);

  return res
    .status(200)
    .json(new ApiResponse(200, { department }, "Department details fetched"));
});

// 🎓 GET DEPARTMENT FEED
const getDepartmentFeed = asyncHandler(async (req, res) => {
  const { deptId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user?._id;

  const { posts, pagination } =
    await departmentServices.getDepartmentFeedService(
      deptId,
      userId,
      page,
      limit
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { posts, pagination }, "Department updates fetched")
    );
});

// 🎓 CREATE DEPARTMENT POST (Admin Only)
const createDepartmentPost = asyncHandler(async (req, res) => {
  const { deptId } = req.params;
  const { content, type = POST_TYPES.NOTICE } = req.body;

  // TODO: Add permission check for admin/moderator

  const postData = {
    content,
    type,
    postOnModel: POST_TARGET_MODELS.DEPARTMENT,
    postOnId: deptId,
    ...req.body,
  };

  const { post, meta } = await createPostService(postData, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { post, meta }, "Official announcement posted"));
});

// 🎓 SEARCH DEPARTMENTS
const searchDepartments = asyncHandler(async (req, res) => {
  const { q, instId } = req.query;

  if (!q) {
    return res
      .status(200)
      .json(new ApiResponse(200, { departments: [] }, "Query is required"));
  }

  const { Department } = await import("../models/department.model.js");

  const query = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { code: { $regex: q, $options: "i" } },
    ],
    isActive: true,
  };

  // If institution ID provided, filter by institution
  if (instId) {
    query.institution = instId;
  }

  const departments = await Department.find(query)
    .select("name code logo institution")
    .populate("institution", "name")
    .limit(20);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { departments }, "Departments searched successfully")
    );
});

export {
  getDepartmentHeader,
  getDepartmentDetails,
  getDepartmentFeed,
  createDepartmentPost,
  searchDepartments,
};
