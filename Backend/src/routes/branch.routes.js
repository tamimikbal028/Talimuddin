import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBranch,
  getMyBranches,
  getAllBranches,
  getBranchDetails,
  joinBranch,
  deleteBranch,
  updateBranch,
  updateBranchCoverImage,
  getBranchPosts,
  getBranchMembers,
  leaveBranch,
  removeMember,
  promoteMember,
  demoteMember,
} from "../controllers/branch.controllers.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

// Branch Routes
router.post("/", createBranch);
router.get("/myBranches", getMyBranches);
router.get("/allBranches", getAllBranches);
router.post("/join", joinBranch);
router.get("/:branchId", getBranchDetails);
router.get("/:branchId/posts", getBranchPosts);
router.get("/:branchId/members", getBranchMembers);
router.patch("/:branchId", updateBranch);
router.patch(
  "/:branchId/cover-image",
  uploadImage.single("coverImage"),
  updateBranchCoverImage
);
router.delete("/:branchId", deleteBranch);
router.delete("/:branchId/leave", leaveBranch);
router.delete("/:branchId/remove/:userId", removeMember);
router.patch("/:branchId/promote/:userId", promoteMember);
router.patch("/:branchId/demote/:userId", demoteMember);

export default router;
