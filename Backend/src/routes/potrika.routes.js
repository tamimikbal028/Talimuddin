import { Router } from "express";

// Middlewares
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

// Controllers
import {
  getPotrikaHeader,
  getPotrikaPosts,
  updatePotrikaAvatar,
  updatePotrikaCoverImage,
  updatePotrikaDetails,
} from "../controllers/potrika.controllers.js";

const router = Router();

// All potrika routes require authenticated user
router.use(verifyJWT);

// GET /potrika/:potrikaId
router.get("/:potrikaId", getPotrikaHeader);

// GET /potrika/:potrikaId/posts
router.get("/:potrikaId/posts", getPotrikaPosts);

// Update potrika avatar (admin only - middleware will be added)
router.patch(
  "/:potrikaId/avatar",
  uploadImage.single("avatar"),
  updatePotrikaAvatar
);

// Update potrika cover image (admin only - middleware will be added)
router.patch(
  "/:potrikaId/cover-image",
  uploadImage.single("coverImage"),
  updatePotrikaCoverImage
);

// Update potrika details (admin only - middleware will be added)
router.patch("/:potrikaId/update-details", updatePotrikaDetails);

export default router;
