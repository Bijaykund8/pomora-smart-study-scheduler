import Session from "../models/Session.js";
import Activity from "../models/Activity.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    /* ===============================
       TOTAL FOCUS TIME (FROM SESSIONS)
    =============================== */

    const sessions = await Session.find({ user: userId });

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );

    const totalHours = (totalMinutes / 60).toFixed(1);

    const avgSession =
      sessions.length > 0
        ? Math.round(totalMinutes / sessions.length)
        : 0;

    /* ===============================
       TASKS COMPLETED (FROM ACTIVITY)
    =============================== */

    const tasksCompleted = await Activity.countDocuments({
      user: userId,
      type: "completed",
    });

    /* ===============================
       STREAK (BASED ON SESSIONS)
    =============================== */

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setHours(23, 59, 59, 999);

      const hasSession = sessions.some(
        (s) =>
          s.completedAt &&
          s.completedAt >= day &&
          s.completedAt <= nextDay
      );

      if (hasSession) streak++;
      else break;
    }

    /* ===============================
       WEEKLY DATA (FROM SESSIONS)
    =============================== */

    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const count = sessions.filter(
        (s) =>
          s.completedAt &&
          s.completedAt >= day &&
          s.completedAt <= end
      ).length;

      weeklyData.push({
        name: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        sessions: count,
      });
    }

    const trend = 0;

    /* ===============================
       YEARLY HEATMAP DATA (FIXED)
    =============================== */

    const yearlyActivity = [];

    for (let i = 364; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const count = await Activity.countDocuments({
        user: userId,
        type: "completed",
        createdAt: { $gte: day, $lte: end },
      });

      yearlyActivity.push({
        date: day.toISOString().split("T")[0],
        count,
      });
    }

    /* ===============================
       RETURN RESPONSE
    =============================== */

    res.json({
      totalHours,
      avgSession,
      streak,
      weeklyData,
      trend,
      tasksCompleted,
      yearlyActivity,
    });

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Failed to get stats" });
  }
};