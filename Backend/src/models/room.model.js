import mongoose, { Schema } from "mongoose";
import { ROOM_TYPES, ROOM_PRIVACY } from "../constants/index.js";

const roomSchema = new Schema(
  {
    // --- 1. Basic Info ---
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

    // --- 2. Room Type ---
    roomType: {
      type: String,
      enum: Object.values(ROOM_TYPES),
      required: true,
    },

    // --- 3. Privacy ---
    privacy: {
      type: String,
      enum: Object.values(ROOM_PRIVACY),
      default: ROOM_PRIVACY.PUBLIC,
      index: true,
    },

    // --- 4. Access ---
    joinCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    // --- 5. Management ---
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --- 6. Status Flags ---
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // --- 7. Config ---
    settings: {
      allowStudentPosting: { type: Boolean, default: true },
      allowComments: { type: Boolean, default: true },
      requirePostApproval: { type: Boolean, default: false },
    },

    membersCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// --- Indexes ---
roomSchema.index({ isArchived: 1, isDeleted: 1 });
roomSchema.index({ privacy: 1, isDeleted: 1 });

export const Room = mongoose.model("Room", roomSchema);
