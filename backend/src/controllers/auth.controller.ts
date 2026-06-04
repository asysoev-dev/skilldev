import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../server";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  //   verifyRefreshToken,
} from "../utils/jwt";

/**
 * Регистрация нового пользователя
 *
 * @param {Request} req - body: { email, password, name }
 * @param {Response} res
 * @returns {Promise<void>}
 * @description 201 - успех, 400 - email занят, 500 - ошибка сервера
 */

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
    return;
  }
};

/**
 * Вход пользователя в систему
 *
 * @param {Request} req - body: { email, password }
 * @param {Response} res
 * @returns {Promise<void>}
 * @description 200 - успех (accessToken + user), 401 - неверные данные, 500 - ошибка сервера
 */

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
    return;
  }
};

/**
 * Выход из системы (удаление сессии)
 *
 * @param {Request} req - cookies.refreshToken
 * @param {Response} res
 * @description Удаляет refreshToken из БД и очищает cookie
 */

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.session.deleteMany({ where: { refreshToken } });
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

/**
 * Обновление accessToken через refreshToken
 *
 * @param {Request} req - cookies.refreshToken
 * @param {Response} res
 * @returns {Promise<void>}
 * @description 200 - новый accessToken, 401 - нет токена, 403 - невалидный/просроченный
 */

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token required" });
    return;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      res.status(403).json({ error: "Invalid or expired refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken(
      session.user.id,
      session.user.email,
    );

    res.json({ accessToken: newAccessToken });
    return;
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
    return;
  }
};

/**
 * Получение данных текущего пользователя
 *
 * @param {Request} req - headers.authorization: Bearer <accessToken>
 * @param {Response} res
 * @returns {Promise<void>}
 * @description 200 - данные пользователя (id, email, name, createdAt), 401 - нет токена, 403 - невалидный, 404 - не найден
 */

export const me = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
