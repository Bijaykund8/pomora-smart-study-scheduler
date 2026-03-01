import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* =========================
       PROFILE INFO
    ========================= */
    photo: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
    },

    goal: {
      type: String,
      maxlength: 200,
      default: "",
    },

    /* =========================
       PRODUCTIVITY
    ========================= */
    totalFocusTime: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    tasksCompleted: {
      type: Number,
      default: 0,
    },

    weeklyProgress: {
      type: Number,
      default: 0,
    },

    /* =========================
       ACCOUNT STATUS
    ========================= */
    isActive: {
      type: Boolean,
      default: true,
    },

    /* =========================
       OTP FIELDS (IMPORTANT)
    ========================= */
    otp: {
      type: String,          // MUST be string
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);