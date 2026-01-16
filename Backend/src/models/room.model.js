import mongoose, { Schema } from "mongoose";
import { ROOM_TYPES } from "../constants/index.js";

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

    settings: {
      allowStudentPosting: { type: Boolean, default: false },
      requirePostApproval: { type: Boolean, default: true },
    },

    parentRoom: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
