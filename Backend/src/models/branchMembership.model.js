import mongoose from "mongoose";

const branchMembershipSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isPending: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Unique Constraint
branchMembershipSchema.index({ branch: 1, user: 1 }, { unique: true });
branchMembershipSchema.index({ branch: 1, isPending: 1 });

export const BranchMembership = mongoose.model(
  "BranchMembership",
  branchMembershipSchema
);
