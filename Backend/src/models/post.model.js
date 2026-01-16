import mongoose, { Schema } from "mongoose";
import {
  ATTACHMENT_TYPES,
  POST_TARGET_MODELS,
  POST_VISIBILITY,
} from "../constants/index.js";

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
      maxLength: 5000,
    },

    attachments: [
      {
        // (image, video, pdf, doc, link)
        type: {
          type: String,
          enum: Object.values(ATTACHMENT_TYPES),
          required: true,
        },
        // url from cloudinary
        url: { type: String, required: true },
        name: { type: String },
        size: { type: Number },
      },
    ],

    postOnModel: {
      type: String,
      required: true,
      enum: Object.values(POST_TARGET_MODELS),
      required: true,
      index: true,
    },
    postOnId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "postOnModel",
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: Object.values(POST_VISIBILITY),
      default: POST_VISIBILITY.PUBLIC,
      index: true,
    },

    pollOptions: [
      {
        text: { type: String },
        votes: { type: Number, default: 0 },
        voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    tags: [{ type: String, trim: true }],

    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },

    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Search Indexes for Text Search
postSchema.index(
  {
    content: "text",
    tags: "text",
  },
  {
    weights: {
      content: 10,
      tags: 5,
    },
    name: "post_search_text_index",
  }
);

// ✅ Compound Indexes for Filtered Search and Performance
postSchema.index({ postOnId: 1, postOnModel: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ author: 1, visibility: 1, isDeleted: 1 });

export const Post = mongoose.model("Post", postSchema);
