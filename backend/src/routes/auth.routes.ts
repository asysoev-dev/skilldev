import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  me,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, me);

export default router;
