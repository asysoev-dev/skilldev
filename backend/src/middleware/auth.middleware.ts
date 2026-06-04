import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

/**
 * Middleware для проверки JWT access token
 *
 * @param {AuthRequest} req - Добавляет user в req при успешной проверке
 * @param {Response} res
 * @param {NextFunction} next
 * @description 401 - нет токена, 403 - невалидный/просроченный, 200 - добавляет req.user и вызывает next()
 */

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as any;
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};
