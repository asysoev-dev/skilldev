import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env.dev"),
});

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: number, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

// export const verifyRefreshToken = (token: string) => {
//   return jwt.verify(token, JWT_REFRESH_SECRET);
// };
