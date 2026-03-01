import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, RotateCcw, Trash2, Calendar } from "lucide-react";
import API from "../api";

export default function ActivityFeed({ darkMode }) {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

  const s = getStyles(darkMode);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/activity");
      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load activities", error);
      setActivities([]);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return { relative: "Just now", full: "—" };

    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return { relative: "Just now", full: "—" };

    const now = new Date();
    const diff = Math.floor((now - d) / 60000);

    let relative;
    if (diff < 1) relative = "Just now";
    else if (diff < 60) relative = `${diff}m ago`;
    else if (diff < 1440) relative = `${Math.floor(diff / 60)}h ago`;
    else relative = `${Math.floor(diff / 1440)}d ago`;

    const full = d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { relative, full };
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "completed":
        return {
          gradient: "linear-gradient(135deg, #34d399, #10b981)",
          glow: "0 0 12px rgba(16,185,129,0.6)",
          icon: <CheckCircle size={20} color="white" />,
        };
      case "incomplete":
        return {
          gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
          glow: "0 0 12px rgba(245,158,11,0.6)",
          icon: <RotateCcw size={20} color="white" />,
        };
      case "deleted":
        return {
          gradient: "linear-gradient(135deg, #f87171, #ef4444)",
          glow: "0 0 12px rgba(239,68,68,0.6)",
          icon: <Trash2 size={20} color="white" />,
        };
      case "scheduled":
        return {
          gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)",
          glow: "0 0 12px rgba(59,130,246,0.6)",
          icon: <Calendar size={20} color="white" />,
        };
      default:
        return {
          gradient: "linear-gradient(135deg, #94a3b8, #64748b)",
          glow: "0 0 12px rgba(100,116,139,0.6)",
          icon: <CheckCircle size={20} color="white" />,
        };
    }
  };

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter);

  return (
    <motion.div
      style={s.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div style={s.header}>
        <h3>Activity Feed</h3>

        <div style={{ position: "relative" }}>
          <motion.span
            style={s.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.1 }}
          >
            •••
          </motion.span>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={s.dropdown}
            >
              {["all", "completed", "incomplete", "deleted", "scheduled"].map(
                (type) => (
                  <div
                    key={type}
                    style={{
                      ...s.dropdownItem,
                      background:
                        filter === type
                          ? darkMode
                            ? "rgba(59,130,246,0.2)"
                            : "rgba(59,130,246,0.1)"
                          : "transparent",
                    }}
                    onClick={() => {
                      setFilter(type);
                      setMenuOpen(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* FEED */}
      <div style={s.feed}>
        <AnimatePresence>
          {filteredActivities.map((activity, index) => {
            const timeValue =
              activity.createdAt ||
              activity.updatedAt ||
              activity.time ||
              null;

            const timeData = formatDateTime(timeValue);
            const typeStyle = getTypeStyle(activity.type);

            return (
              <motion.div
                key={activity._id || index}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: darkMode
                    ? "0 18px 30px rgba(0,0,0,0.6)"
                    : "0 18px 30px rgba(0,0,0,0.08)",
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={s.item}
              >
                <motion.div
                  style={{
                    ...s.icon,
                    background: typeStyle.gradient,
                    boxShadow: typeStyle.glow,
                  }}
                >
                  {typeStyle.icon}
                </motion.div>

                <div style={{ flex: 1 }}>
                  <div style={s.row}>
                    <strong>
                      {activity.taskTitle ||
                        activity.title ||
                        "Untitled Task"}
                    </strong>

                    <div style={s.timeBlock}>
                      <span style={s.relativeTime}>
                        {timeData.relative}
                      </span>
                      <span style={s.fullTime}>
                        {timeData.full}
                      </span>
                    </div>
                  </div>

                  <p style={s.desc}>
                    {activity.type === "completed" &&
                      `Completed ${activity.duration || 0} min session`}
                    {activity.type === "incomplete" &&
                      `Marked as incomplete`}
                    {activity.type === "deleted" && `Task deleted`}
                    {activity.type === "scheduled" &&
                      `Scheduled for ${activity.duration || 0} mins`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function getStyles(darkMode) {
  return {
    card: {
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "linear-gradient(135deg,#f0f9ff,#e0f2fe,#f8fafc)",
      borderRadius: "24px",
      padding: "25px",
      boxShadow: darkMode
        ? "0 20px 50px rgba(0,0,0,0.6)"
        : "0 20px 40px rgba(37,99,235,0.08)",
      border: darkMode ? "1px solid #334155" : "1px solid rgba(255,255,255,0.6)",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      transition: "all 0.3s ease",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },

    menuButton: {
      cursor: "pointer",
      fontSize: "18px",
      padding: "4px 8px",
    },

    dropdown: {
      position: "absolute",
      right: 0,
      top: "30px",
      background: darkMode ? "#1e293b" : "white",
      borderRadius: "12px",
      boxShadow: darkMode
        ? "0 15px 30px rgba(0,0,0,0.6)"
        : "0 15px 30px rgba(0,0,0,0.08)",
      padding: "8px",
      width: "160px",
      zIndex: 10,
      border: darkMode ? "1px solid #334155" : "none",
    },

    dropdownItem: {
      padding: "8px 10px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
    },

    feed: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxHeight: "260px",
      overflowY: "auto",
      paddingRight: "6px",
    },

    item: {
      display: "flex",
      gap: "14px",
      padding: "16px",
      borderRadius: "16px",
      border: darkMode
        ? "1px solid #334155"
        : "1px solid rgba(0,0,0,0.05)",
      background: darkMode ? "#1e293b" : "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },

    icon: {
      width: "46px",
      height: "46px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    desc: {
      fontSize: "14px",
      color: darkMode ? "#94a3b8" : "#64748b",
      marginTop: "6px",
    },

    timeBlock: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },

    relativeTime: {
      fontSize: "13px",
      color: "#2563eb",
      fontWeight: "600",
    },

    fullTime: {
      fontSize: "11px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },
  };
}