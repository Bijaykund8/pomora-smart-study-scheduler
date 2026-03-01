import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import fs from "fs";

const router = express.Router();

/* ==============================
   MULTER CONFIG
============================== */
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/* ==============================
   GET PROFILE
============================== */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* ==============================
   UPDATE PROFILE
============================== */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const allowedFields = ["name", "bio", "education", "dob", "goal"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ==============================
   UPLOAD PROFILE PHOTO
============================== */
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "pomora_profiles",
      });

      // delete local file after upload
      fs.unlinkSync(req.file.path);

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { photo: result.secure_url },
        { new: true }
      ).select("-password");

      res.json({
        message: "Photo uploaded successfully",
        url: result.secure_url,
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

/* ==============================
   CHANGE PASSWORD
============================== */
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password change failed" });
  }
});

/* ==============================
   DELETE ACCOUNT
============================== */
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete account failed" });
  }
});

export default router;