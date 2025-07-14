import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser
} from "../controller/Usercontroller.js";
// Simple middleware for now
const protect = (req, res, next) => {
  // TODO: Implement JWT verification
  next();
};

const loginRateLimiter = (req, res, next) => {
  // TODO: Implement rate limiting
  next();
};

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginRateLimiter, loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/logout", logoutUser);

export default router;
