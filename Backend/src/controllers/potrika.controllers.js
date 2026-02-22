import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import potrikaServices from "../services/potrika.service.js";

// Get potrika header
const getPotrikaHeader = asyncHandler(async (req, res) => {
  const { potrikaId } = req.params;
  const { potrika } = await potrikaServices.getPotrikaHeaderService(potrikaId);
  return res
    .status(200)
    .json(new ApiResponse(200, { potrika }, "Potrika fetched successfully"));
});

// Get potrika posts
const getPotrikaPosts = asyncHandler(async (req, res) => {
  const { potrikaId } = req.params;
  const { posts, pagination } = await potrikaServices.getPotrikaPostsService(
    potrikaId,
    req.user?._id,
    req.query
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, pagination },
        "Potrika posts fetched successfully"
      )
    );
});

// Update potrika avatar
const updatePotrikaAvatar = asyncHandler(async (req, res) => {
  const { potrikaId } = req.params;
  const avatarLocalPath = req.file?.path;
  const { potrika } = await potrikaServices.updatePotrikaAvatarService(
    potrikaId,
    avatarLocalPath
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { potrika }, "Avatar updated successfully"));
});

// Update potrika cover image
const updatePotrikaCoverImage = asyncHandler(async (req, res) => {
  const { potrikaId } = req.params;
  const coverImageLocalPath = req.file?.path;
  const { potrika } = await potrikaServices.updatePotrikaCoverImageService(
    potrikaId,
    coverImageLocalPath
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, { potrika }, "Cover image updated successfully")
    );
});

// Update potrika details
const updatePotrikaDetails = asyncHandler(async (req, res) => {
  const { potrikaId } = req.params;
  const { potrika } = await potrikaServices.updatePotrikaDetailsService(
    potrikaId,
    req.body
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, { potrika }, "Potrika details updated successfully")
    );
});

export {
  getPotrikaHeader,
  getPotrikaPosts,
  updatePotrikaAvatar,
  updatePotrikaCoverImage,
  updatePotrikaDetails,
};
