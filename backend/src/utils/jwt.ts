import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env.dev"),
});

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY!;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY!;

export interface TokenData {
  userId: number;
  email: string;
}

export interface TokenPayload extends TokenData {
  iat: number;
  exp: number;
}

export const generateAccessToken = (userId: number, email: string) => {
  const payload: TokenData = { userId, email };
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${ACCESS_TOKEN_EXPIRY}s`,
  });
};

export const generateRefreshToken = (userId: number) => {
  // @ts-ignore
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY}s`,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};
