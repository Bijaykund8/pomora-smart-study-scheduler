import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Faster user-based queries
    },

    // Store plain title so activity remains even if task is deleted
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // What happened
    type: {
      type: String,
      enum: ["completed", "incomplete", "deleted", "scheduled"],
      required: true,
    },

    // Optional session duration
    duration: {
      type: Number,
      default: 0,
    },

    // Optional metadata (future-proofing)
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster feed loading
activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);