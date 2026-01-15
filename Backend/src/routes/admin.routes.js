import { Router } from "express";
import { verifyJWT, restrictTo } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  updateUserRole,
  getPlatformStats,
} from "../controllers/admin.controllers.js";
import { USER_TYPES } from "../constants/index.js";

const router = Router();

// All routes here require login
router.use(verifyJWT);

// Admin/Owner can see users and stats
router
  .route("/users")
  .get(restrictTo(USER_TYPES.ADMIN, USER_TYPES.OWNER), getAllUsers);
router
  .route("/stats")
  .get(restrictTo(USER_TYPES.ADMIN, USER_TYPES.OWNER), getPlatformStats);

// Only OWNER can change roles
router
  .route("/users/:userId/role")
  .patch(restrictTo(USER_TYPES.OWNER), updateUserRole);

export default router;
