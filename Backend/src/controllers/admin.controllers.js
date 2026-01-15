import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { USER_TYPES } from "../constants/index.js";

/**
 * @desc Get all users with pagination and search
 * @route GET /api/v1/admin/users
 * @access Private (Admin/Owner)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { userName: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query)
    .select("-password -refreshToken")
    .sort("-createdAt")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await User.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalUsers: count,
      },
      "Users fetched successfully"
    )
  );
});

/**
 * @desc Update user role (Promote to Admin)
 * @route PATCH /api/v1/admin/users/:userId/role
 * @access Private (Owner Only)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!Object.values(USER_TYPES).includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Only OWNER can promote/demote to ADMIN/TEACHER
  // OWNER role itself cannot be changed via API for security
  if (role === USER_TYPES.OWNER) {
    throw new ApiError(403, "Cannot change role to OWNER via API");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.userType === USER_TYPES.OWNER) {
    throw new ApiError(403, "Cannot change OWNER's role");
  }

  user.userType = role;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, `User role updated to ${role}`));
});

/**
 * @desc Get platform stats
 * @route GET /api/v1/admin/stats
 * @access Private (Admin/Owner)
 */
const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ userType: USER_TYPES.ADMIN });

  // You can add more stats here as features grow (e.g., total rooms, total posts)

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalAdmins,
      },
      "Stats fetched successfully"
    )
  );
});

export { getAllUsers, updateUserRole, getPlatformStats };
