import mongoose, { Schema } from "mongoose";
import { Room } from "./room.model.js";
import { ROOM_MEMBERSHIP_STATUS } from "../constants/index.js";

const roomMembershipSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Membership Status
    status: {
      type: String,
      enum: Object.values(ROOM_MEMBERSHIP_STATUS),
      default: ROOM_MEMBERSHIP_STATUS.JOINED,
      index: true,
    },

    // CR (Class Representative): Student can be promoted to CR
    isCR: {
      type: Boolean,
      default: false,
    },

    // Admin: Can manage room (archive, edit settings)
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Personal Preference: Hide Room
    isHidden: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique Constraint
roomMembershipSchema.index({ room: 1, user: 1 }, { unique: true });
roomMembershipSchema.index({ user: 1, isHidden: 1 });
roomMembershipSchema.index({ room: 1, status: 1 });

export const RoomMembership = mongoose.model(
  "RoomMembership",
  roomMembershipSchema
);
