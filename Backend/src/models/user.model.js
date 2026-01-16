import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  USER_TYPES,
  GENDERS,
  RELIGIONS,
  ACCOUNT_STATUS,
} from "../constants/index.js";

const userSchema = new Schema(
  {
    // --- Identity ---
    fullName: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    passwordChangedAt: { type: Date },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },

    // --- Profile ---
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    bio: { type: String, trim: true, maxLength: 300 },

    gender: { type: String, enum: Object.values(GENDERS) },
    religion: { type: String, enum: Object.values(RELIGIONS) },

    userType: {
      type: String,
      enum: Object.values(USER_TYPES),
      default: USER_TYPES.STUDENT,
      index: true,
    },

    // --- Status ---
    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    bannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bannedReason: {
      type: String,
      default: null,
      trim: true,
      maxLength: 500,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },
    termsAgreedAt: {
      type: Date,
      default: Date.now,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName, // nickName এর বদলে userName
      userType: this.userType,
      institution: this.institution || null,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
