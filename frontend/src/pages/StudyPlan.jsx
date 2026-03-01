import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

export default function StudyPlan({
  tasks,
  refreshTasks,
  onAddTask,
  darkMode
}) {
  const [deletingId, setDeletingId] = useState(null);

  const s = getStyles(darkMode);

  /* ================= MARK COMPLETE ================= */
  const toggleComplete = async (id) => {
    try {
      await API.patch(`/tasks/${id}`);
      refreshTasks();
    } catch (err) {
      console.error("Complete failed", err);
    }
  };

  /* ================= DELETE TASK ================= */
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await API.delete(`/tasks/${id}`);
      refreshTasks();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <h3>Today's Study Plan</h3>
      </div>

      {tasks.length === 0 ? (
        <p style={s.empty}>No tasks scheduled for today</p>
      ) : (
        <div style={s.scrollContainer}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                style={s.task}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                {/* LEFT */}
                <div
                  style={s.left}
                  onClick={() => toggleComplete(task._id)}
                >
                  <motion.div
                    animate={{
                      backgroundColor: task.completed
                        ? "#10b981"
                        : "transparent",
                      borderColor: task.completed
                        ? "#10b981"
                        : "#3b82f6",
                    }}
                    transition={{ duration: 0.3 }}
                    style={s.checkbox}
                  >
                    {task.completed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{ color: "white", fontSize: "12px" }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>

                  <div>
                    <motion.div
                      style={s.subject}
                      animate={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        opacity: task.completed ? 0.6 : 1,
                      }}
                    >
                      {task.title}
                    </motion.div>

                    <div style={s.subtitle}>
                      Study for {task.duration} mins
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div style={s.right}>
                  <div style={s.time}>
                    {new Date(task.scheduledTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task._id);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "#ef4444",
                      opacity: deletingId === task._id ? 0.4 : 1,
                    }}
                  >
                    🗑
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <button style={s.addBtn} onClick={onAddTask}>
        <Plus size={16} /> Add Task
      </button>
    </div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function getStyles(darkMode) {
  return {
    card: {
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "linear-gradient(135deg,#e0f2fe 0%,#dbeafe 50%,#eff6ff 100%)",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: darkMode
        ? "0 20px 50px rgba(0,0,0,0.6)"
        : "0 20px 40px rgba(37,99,235,0.12)",
      border: darkMode ? "1px solid #334155" : "1px solid rgba(255,255,255,0.6)",
      transition: "all 0.3s ease",
      color: darkMode ? "#f1f5f9" : "#0f172a",
    },

    header: {
      marginBottom: "18px",
      fontWeight: "600",
      fontSize: "20px",
    },

    task: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      marginBottom: "10px",
      borderRadius: "14px",
      background: darkMode ? "#1e293b" : "rgba(255,255,255,0.7)",
      border: darkMode ? "1px solid #334155" : "none",
    },

    left: {
      display: "flex",
      gap: "14px",
      alignItems: "center",
      cursor: "pointer",
    },

    right: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },

    subject: {
      fontWeight: "600",
      fontSize: "16px",
    },

    subtitle: {
      fontSize: "13px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    time: {
      color: darkMode ? "#cbd5e1" : "#64748b",
      fontSize: "14px",
    },

    checkbox: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "2px solid #3b82f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    empty: {
      color: darkMode ? "#94a3b8" : "#64748b",
      padding: "12px 0",
      fontSize: "14px",
    },

    addBtn: {
      marginTop: "18px",
      padding: "14px",
      borderRadius: "14px",
      border: "2px dashed #3b82f6",
      background: darkMode
        ? "rgba(37,99,235,0.1)"
        : "rgba(255,255,255,0.8)",
      color: "#2563eb",
      cursor: "pointer",
      width: "100%",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },

    scrollContainer: {
      maxHeight: "360px",
      overflowY: "auto",
      paddingRight: "6px",
    },
  };
}