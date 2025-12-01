import jwt from "jsonwebtoken";

// =========================
// GENERATE TOKEN
// =========================
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });
};

// =========================
// VERIFY TOKEN
// =========================
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
