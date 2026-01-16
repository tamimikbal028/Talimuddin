import mongoose, { Schema } from "mongoose";
import { INSTITUTION_TYPES, INSTITUTION_CATEGORY } from "../constants/index.js";

const institutionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    // ✅ Using Constant
    type: {
      type: String,
      enum: Object.values(INSTITUTION_TYPES),
      default: INSTITUTION_TYPES.GENERAL_UNIVERSITY,
      required: true,
      index: true,
    },

    // ✅ NEW FIELD: Category (Public / Private)
    category: {
      type: String,
      enum: Object.values(INSTITUTION_CATEGORY),
      default: INSTITUTION_CATEGORY.PUBLIC,
      index: true,
    },

    validDomains: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    location: { type: String, required: true },
    website: { type: String },
    logo: { type: String, required: true },
    coverImage: { type: String },

    contactEmails: [{ type: String, lowercase: true, trim: true }],
    contactPhones: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    departmentsCount: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Search Indexes for Text Search
institutionSchema.index(
  {
    name: "text",
    location: "text",
    code: "text",
  },
  {
    weights: {
      name: 10, // Highest priority for name matches
      code: 8, // High priority for code matches
      location: 3, // Lower priority for location matches
    },
    name: "institution_search_text_index",
  }
);

// ✅ Compound Indexes for Filtered Search
institutionSchema.index({ validDomains: 1 });
institutionSchema.index({ type: 1, category: 1 });
institutionSchema.index({ location: 1, type: 1 });

export const Institution = mongoose.model("Institution", institutionSchema);
