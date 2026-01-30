import mongoose from "mongoose";
import { BRANCH_TYPES } from "../constants/index.js";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    coverImage: {
      type: String,
      required: true,
    },

    // --- 2. Branch Type ---
    branchType: {
      type: String,
      enum: Object.values(BRANCH_TYPES),
      required: true,
    },

    joinCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    membersCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },

    parentBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", branchSchema);
