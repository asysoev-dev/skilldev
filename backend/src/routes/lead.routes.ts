import { Router } from "express";
import { getLeads, getLead, getFilters } from "../controllers/lead.controller";

const router = Router();

router.get("/", getLeads);
router.get("/filters", getFilters);
router.get("/:id", getLead);

export default router;
