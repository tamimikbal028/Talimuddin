import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createRoom,
  getMyRooms,
  getHiddenRooms,
  getArchivedRooms,
  getRoomDetails,
  joinRoom,
  cancelJoinRequest,
  acceptJoinRequest,
  rejectJoinRequest,
  toggleArchiveRoom,
  deleteRoom,
  hideRoom,
  updateRoom,
  updateRoomCoverImage,
  getRoomPosts,
  getRoomMembers,
  getRoomPendingRequests,
  leaveRoom,
  getRoomPendingPosts,
  approvePost,
  rejectPost,
  removeMember,
  promoteMember,
  demoteMember,
} from "../controllers/room.controllers.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

// Room Routes
router.post("/", createRoom);
router.get("/myRooms", getMyRooms);
router.get("/hiddenRooms", getHiddenRooms);
router.get("/archivedRooms", getArchivedRooms);
router.post("/join", joinRoom);
router.get("/:roomId", getRoomDetails);
router.get("/:roomId/posts", getRoomPosts);
router.get("/:roomId/members", getRoomMembers);
router.get("/:roomId/requests", getRoomPendingRequests);
router.patch("/:roomId", updateRoom);
router.patch(
  "/:roomId/cover-image",
  uploadImage.single("coverImage"),
  updateRoomCoverImage
);
router.patch("/:roomId/archive", toggleArchiveRoom);
router.delete("/:roomId", deleteRoom);
router.patch("/:roomId/hide", hideRoom);
router.delete("/:roomId/leave", leaveRoom);
router.delete("/:roomId/cancel-request", cancelJoinRequest);
router.patch("/:roomId/accept/:userId", acceptJoinRequest);
router.patch("/:roomId/reject/:userId", rejectJoinRequest);
router.delete("/:roomId/remove/:userId", removeMember);
router.patch("/:roomId/promote/:userId", promoteMember);
router.patch("/:roomId/demote/:userId", demoteMember);

// Post Moderation
router.get("/:roomId/pending-posts", getRoomPendingPosts);
router.patch("/:roomId/posts/:postId/approve", approvePost);
router.patch("/:roomId/posts/:postId/reject", rejectPost);

export default router;
