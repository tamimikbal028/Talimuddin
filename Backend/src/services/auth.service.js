import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { USER_TYPES } from "../constants/index.js";
import jwt from "jsonwebtoken";

// --- Utility: Token Generator ---
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("JWT Generation Error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// ==========================================
// 🚀 1. REGISTER USER SERVICE
// ==========================================
const registerUserService = async (userData) => {
  const { fullName, phoneNumber, password, userName, agreeToTerms } = userData;

  // Always set userType to USER
  const userType = USER_TYPES.USER;

  const existedUser = await User.findOne({
    $or: [{ phoneNumber }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User with this phone number or username already exists"
    );
  }

  if ([USER_TYPES.ADMIN, USER_TYPES.OWNER].includes(userType)) {
    throw new ApiError(403, "Restricted user type.");
  }

  const userPayload = {
    fullName,
    phoneNumber,
    password,
    userName,
    userType,
    agreeToTerms,
    termsAgreedAt: new Date(),
  };

  const user = await User.create(userPayload);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Token generation
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return { user: createdUser, accessToken, refreshToken };
};

// ==========================================
// 🚀 2. LOGIN USER SERVICE
// ==========================================
const loginUserService = async ({ identifier, password }) => {
  if (!identifier) {
    throw new ApiError(400, "Username, Email, or Phone Number is required");
  }

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { phoneNumber: identifier },
      { userName: identifier },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return { user: loggedInUser, accessToken, refreshToken };
};

// ==========================================
// 🚀 3. LOGOUT USER SERVICE
// ==========================================
const logoutUserService = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  return {};
};

// ==========================================
// 🚀 4. REFRESH TOKEN SERVICE
// ==========================================
const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

// ==========================================
// 🚀 5. CHANGE PASSWORD SERVICE
// ==========================================
const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  return {};
};

const authServices = {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  changePasswordService,
};

export default authServices;
