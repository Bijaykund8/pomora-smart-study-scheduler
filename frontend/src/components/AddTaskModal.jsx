import { useState, useRef, useEffect } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function AddTaskModal({ onClose, onTaskCreated, darkMode }) {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    scheduledTime: "",
    duration: ""
  });

  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const firstInput = modalRef.current?.querySelector("input");
    firstInput?.focus();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.subject || !form.scheduledTime || !form.duration) {
      alert("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/tasks", {
        title: form.title.trim(),
        subject: form.subject.trim(),
        scheduledTime: form.scheduledTime,
        duration: Number(form.duration)
      });

      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error("TASK ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const s = styles(darkMode);

  return (
    <motion.div
      style={s.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        ref={modalRef}
        style={s.modal}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h2 style={s.title}>Add New Task</h2>

        <form onSubmit={handleSubmit} style={s.form}>
          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            style={s.input}
            required
          />

          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            style={s.input}
            required
          />

          <input
            type="datetime-local"
            name="scheduledTime"
            value={form.scheduledTime}
            onChange={handleChange}
            style={s.input}
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (mins)"
            value={form.duration}
            onChange={handleChange}
            style={s.input}
            required
          />

          <div style={s.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={s.cancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={s.save}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function styles(darkMode) {
  return {
    overlay: {
      position: "fixed",
      inset: 0,
      background: darkMode
        ? "rgba(0,0,0,0.6)"
        : "rgba(0,0,0,0.35)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 200
    },

    modal: {
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "white",
      padding: "32px",
      borderRadius: "24px",
      width: "420px",
      boxShadow: darkMode
        ? "0 20px 60px rgba(0,0,0,0.6)"
        : "0 30px 60px rgba(0,0,0,0.2)",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      border: darkMode ? "1px solid #334155" : "none",
      transition: "all 0.3s ease"
    },

    title: {
      marginBottom: "20px",
      fontSize: "22px",
      fontWeight: "700"
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },

    input: {
      padding: "12px",
      borderRadius: "12px",
      border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
      background: darkMode ? "#1e293b" : "white",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      outline: "none",
      fontSize: "14px",
      transition: "all 0.2s ease"
    },

    buttons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px"
    },

    cancel: {
      background: darkMode ? "#334155" : "#e5e7eb",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      border: "none",
      padding: "10px 18px",
      borderRadius: "12px",
      fontWeight: "500",
      cursor: "pointer"
    },

    save: {
      background: "linear-gradient(135deg,#2563eb,#06b6d4)",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "12px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: darkMode
        ? "0 8px 20px rgba(37,99,235,0.6)"
        : "0 8px 20px rgba(37,99,235,0.3)"
    }
  };
}