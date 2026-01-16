import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getInstitutionHeader,
  getInstitutionFeed,
  createInstitutionPost,
  getInstitutionDetails,
  getDepartmentsList,
  searchInstitutions,
} from "../controllers/institution.controllers.js";

const router = Router();
router.use(verifyJWT);

router.get("/search", searchInstitutions);
router.get("/:instId/header", getInstitutionHeader);
router.get("/:instId/details", getInstitutionDetails);
router.get("/:instId/feed", getInstitutionFeed);
router.get("/:instId/departments", getDepartmentsList);
router.post("/:instId/post", createInstitutionPost);

export default router;
