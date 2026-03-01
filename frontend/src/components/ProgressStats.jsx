import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

export default function ProgressStats({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats error", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  const s = styles(darkMode);

  const totalHours = stats.totalHours ?? 0;
  const avgSession = stats.avgSession ?? 0;
  const streak = stats.streak ?? 0;
  const trend = stats.trend ?? 0;
  const tasksCompleted = stats.tasksCompleted ?? 0;
  const yearlyActivity = stats.yearlyActivity ?? [];

  const today = new Date();
  const currentYear = today.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const monthDays = [];
  const startOffset = firstDay.getDay();

  for (let i = 0; i < startOffset; i++) monthDays.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++)
    monthDays.push(new Date(currentYear, currentMonth, i));

  const trendPositive = trend >= 0;

  return (
    <div style={s.card}>
      <h3 style={s.title}>Progress Overview</h3>

      {/* METRICS */}
      <motion.div style={s.metric} whileHover={{ y: -4 }}>
        <p style={s.label}>Total Focus Time</p>
        <h2 style={s.value}>{totalHours} hrs</h2>
        <p style={s.sub}>Avg {avgSession} mins / session</p>
      </motion.div>

      <motion.div style={s.metric} whileHover={{ y: -4 }}>
        <p style={s.label}>Current Streak</p>
        <h2 style={s.value}>🔥 {streak} days</h2>
      </motion.div>

      <motion.div style={s.metric} whileHover={{ y: -4 }}>
        <p style={s.label}>Tasks Completed</p>
        <h2 style={{ ...s.value, color: "#16a34a" }}>
          ✅ {tasksCompleted}
        </h2>
      </motion.div>

      <motion.div style={s.metric} whileHover={{ y: -4 }}>
        <p style={s.label}>Weekly Trend</p>
        <h2
          style={{
            ...s.value,
            color: trendPositive ? "#16a34a" : "#dc2626",
          }}
        >
          {trendPositive ? "↑" : "↓"} {Math.abs(trend)}%
        </h2>
      </motion.div>

      {/* CALENDAR */}
      <div style={s.calendarWrapper}>
        <div style={s.monthSelector}>
          <button
            style={s.monthBtn}
            onClick={() =>
              setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
            }
          >
            ◀
          </button>

          <span style={s.monthTitle}>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </span>

          <button
            style={s.monthBtn}
            onClick={() =>
              setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
            }
          >
            ▶
          </button>
        </div>

        <div style={s.dayHeaderGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={s.dayHeader}>
              {d}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            style={s.calendarGrid}
          >
            {monthDays.map((dateObj, index) => {
              if (!dateObj) return <div key={index}></div>;

              const iso = dateObj.toISOString().split("T")[0];
              const count =
                yearlyActivity.find((d) => d.date === iso)?.count || 0;

              const isFuture = dateObj > today;

              return (
                <motion.div
                  key={index}
                  onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      text:
                        count > 0
                          ? `${iso} — ${count} completed`
                          : `${iso} — No activity`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  whileHover={{ scale: 1.3 }}
                  style={{
                    ...s.calendarDay,
                    backgroundColor:
                      count > 0
                        ? "#16a34a"
                        : darkMode
                        ? "#334155"
                        : "#e5e7eb",
                    opacity: isFuture ? 0.3 : 1,
                  }}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {tooltip && (
          <div
            style={{
              ...s.tooltip,
              left: tooltip.x,
              top: tooltip.y - 8,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function styles(darkMode) {
  return {
    card: {
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "linear-gradient(135deg,#e0f2fe,#dbeafe,#eff6ff)",
      padding: "30px",
      borderRadius: "24px",
      boxShadow: darkMode
        ? "0 10px 40px rgba(0,0,0,0.4)"
        : "0 20px 40px rgba(37,99,235,0.12)",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      transition: "all 0.3s ease",
    },

    title: {
      marginBottom: "22px",
      fontSize: "20px",
      fontWeight: "600",
    },

    metric: {
      background: darkMode ? "#1e293b" : "white",
      padding: "18px",
      borderRadius: "16px",
      marginBottom: "18px",
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.4)"
        : "0 5px 20px rgba(0,0,0,0.05)",
      border: darkMode ? "1px solid #334155" : "none",
    },

    label: {
      fontSize: "13px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    value: {
      fontSize: "26px",
      fontWeight: "700",
    },

    sub: {
      fontSize: "13px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    calendarWrapper: {
      marginTop: "25px",
      background: darkMode ? "#1e293b" : "white",
      padding: "20px",
      borderRadius: "16px",
      position: "relative",
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.4)"
        : "0 5px 20px rgba(0,0,0,0.05)",
      border: darkMode ? "1px solid #334155" : "none",
    },

    monthSelector: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      alignItems: "center",
    },

    monthBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
    },

    monthTitle: {
      fontWeight: "600",
    },

    dayHeaderGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      marginBottom: "8px",
    },

    dayHeader: {
      fontSize: "12px",
      textAlign: "center",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: "8px",
    },

    calendarDay: {
      height: "16px",
      width: "16px",
      borderRadius: "4px",
      cursor: "pointer",
    },

    tooltip: {
      position: "fixed",
      transform: "translate(-50%, -100%)",
      background: darkMode ? "#0f172a" : "#111827",
      color: "white",
      fontSize: "12px",
      padding: "6px 10px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 9999,
    },
  };
}