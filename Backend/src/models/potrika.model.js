import mongoose from "mongoose";

const potrikaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Potrika = mongoose.model("Potrika", potrikaSchema);
