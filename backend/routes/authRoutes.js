import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// OTP Password Reset Flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;