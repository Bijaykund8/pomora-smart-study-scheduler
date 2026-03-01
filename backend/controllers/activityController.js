import Activity from "../models/Activity.js";

export const getActivityFeed = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(activities);
  } catch (error) {
    console.error("Activity feed error:", error);
    res.status(500).json({ message: "Failed to load activities" });
  }
};