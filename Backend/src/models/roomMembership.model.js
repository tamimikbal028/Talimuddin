import mongoose, { Schema } from "mongoose";
import { Room } from "./room.model.js";

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

    // Join Request Status
    isPending: {
      type: Boolean,
      default: true,
      index: true,
    },

    isTeacher: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Unique Constraint
roomMembershipSchema.index({ room: 1, user: 1 }, { unique: true });
roomMembershipSchema.index({ room: 1, isPending: 1 });

export const RoomMembership = mongoose.model(
  "RoomMembership",
  roomMembershipSchema
);
