import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { POST_TARGET_MODELS, POST_TYPES } from "../constants/index.js";
import { createPostService } from "../services/common/post.service.js";
import { Institution } from "../models/institution.model.js";
import { institutionServices } from "../services/institution.service.js";
import mongoose from "mongoose";

// 🏛️ GET INSTITUTION FEED
const getInstitutionFeed = asyncHandler(async (req, res) => {
  const { instId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user?._id;

  const { posts, pagination } =
    await institutionServices.getInstitutionFeedService(
      instId,
      userId,
      page,
      limit
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { posts, pagination }, "Institution updates fetched")
    );
});

// 🏛️ CREATE INSTITUTION POST (Admin Only)
const createInstitutionPost = asyncHandler(async (req, res) => {
  const { instId } = req.params;
  const { content, type = POST_TYPES.NOTICE } = req.body;

  // TODO: Add permission check for admin/moderator

  const postData = {
    content,
    type,
    postOnModel: POST_TARGET_MODELS.INSTITUTION,
    postOnId: instId,
    ...req.body,
  };

  const { post, meta } = await createPostService(postData, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, { post, meta }, "Official announcement posted"));
});

// 🚀 1. GET INSTITUTION HEADER
const getInstitutionHeader = asyncHandler(async (req, res) => {
  const { instId } = req.params;
  const userId = req.user?._id;

  const { institution, meta } =
    await institutionServices.getInstitutionHeaderService(instId, userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { institution, meta }, "Institution header fetched")
    );
});

// 🚀 2. GET INSTITUTION DETAILS
const getInstitutionDetails = asyncHandler(async (req, res) => {
  const { instId } = req.params;

  const { institution } =
    await institutionServices.getInstitutionDetailsService(instId);

  return res
    .status(200)
    .json(new ApiResponse(200, { institution }, "Institution details fetched"));
});

// 🚀 3. GET DEPARTMENTS LIST
const getDepartmentsList = asyncHandler(async (req, res) => {
  const { instId } = req.params;

  const { departments } =
    await institutionServices.getDepartmentsListService(instId);

  return res
    .status(200)
    .json(new ApiResponse(200, { departments }, "Departments list fetched"));
});

// 🚀 4. SEARCH INSTITUTIONS
const searchInstitutions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(200)
      .json(new ApiResponse(200, { institutions: [] }, "Query is required"));
  }

  const query = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { code: { $regex: q, $options: "i" } },
    ],
    isActive: true,
  };

  const institutions = await Institution.find(query)
    .select("name code logo type")
    .limit(20);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { institutions },
        "Institutions searched successfully"
      )
    );
});

export {
  getInstitutionHeader,
  getInstitutionFeed,
  createInstitutionPost,
  getInstitutionDetails,
  getDepartmentsList,
  searchInstitutions,
};
