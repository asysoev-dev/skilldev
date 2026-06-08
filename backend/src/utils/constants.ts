export const CORS_OPTIONS = {
  origin: process.env.FRONTEND_URL || "http://localhost:3005",
  credentials: true, // cookies
};

export const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
};
