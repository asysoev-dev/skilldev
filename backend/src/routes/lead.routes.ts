import { Router } from "express";
import {
  getLeads,
  getLead,
  getFilters,
  createLead,
  updateLead,
  deleteLead,
  resetLeads,
} from "../controllers/lead.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/', optionalAuthMiddleware, getLeads);
router.get("/filters", getFilters);

router.post("/reset", authMiddleware, resetLeads); // роут /reset должен идти перед /:id

router.get("/:id", getLead);
router.post("/", authMiddleware, createLead);
router.patch("/:id", authMiddleware, updateLead);
router.delete("/:id", authMiddleware, deleteLead);

export default router;
