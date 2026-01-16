import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getDepartmentHeader,
  getDepartmentDetails,
  getDepartmentFeed,
  createDepartmentPost,
  searchDepartments,
} from "../controllers/department.controllers.js";

const router = Router();
router.use(verifyJWT);

router.get("/search", searchDepartments);
router.get("/:deptId/header", getDepartmentHeader);
router.get("/:deptId/details", getDepartmentDetails);
router.get("/:deptId/feed", getDepartmentFeed);
router.post("/:deptId/post", createDepartmentPost);

export default router;
