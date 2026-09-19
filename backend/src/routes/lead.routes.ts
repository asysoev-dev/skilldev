import { Router } from "express";
import {
  getLeads,
  getLead,
  getFilters,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getLeads);
router.get("/filters", getFilters);
router.get("/:id", getLead);

router.post("/", authMiddleware, createLead);
router.patch("/:id", authMiddleware, updateLead);
router.delete("/:id", authMiddleware, deleteLead);

export default router;
