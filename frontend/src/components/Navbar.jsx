import { Bell, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onNewTask, darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    photo: "",
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        ...styles.navbar,
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
          : "linear-gradient(135deg, #93c5fd 0%, #bfdbfe 50%, #dbeafe 100%)",
        color: darkMode ? "#f1f5f9" : "#1e293b",
      }}
    >
      {/* LEFT - LOGO */}
      <div style={styles.logoContainer}>
        <span style={styles.logoIcon}>🍅</span>
        <h2
          style={{
            ...styles.logoText,
            color: darkMode ? "#f1f5f9" : "#0f172a",
          }}
        >
          Pomora
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightSection}>
        {/* ICONS */}
        <motion.div whileHover={{ scale: 1.2 }}>
          <Bell
            size={20}
            style={{
              ...styles.icon,
              color: darkMode ? "#cbd5e1" : "#334155",
            }}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }}>
          <MessageCircle
            size={20}
            style={{
              ...styles.icon,
              color: darkMode ? "#cbd5e1" : "#334155",
            }}
          />
        </motion.div>

        {/* 🌙 DARK MODE TOGGLE */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          style={styles.darkToggle}
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.div>

        {/* NEW TASK BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(59,130,246,0.7)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewTask}
          style={styles.button}
        >
          + New Task
        </motion.button>

        {/* PROFILE AVATAR */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile-settings")}
          style={styles.avatarWrapper}
        >
          {user.photo ? (
            <img src={user.photo} alt="profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================= STYLES ================= */

const styles = {
  navbar: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 15px rgba(59,130,246,0.15)",
    transition: "all 0.3s ease",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoIcon: {
    fontSize: "26px",
  },

  logoText: {
    fontWeight: "900",
    fontSize: "26px",
    letterSpacing: "2px",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  icon: {
    cursor: "pointer",
  },

  darkToggle: {
    cursor: "pointer",
    fontSize: "18px",
  },

  button: {
    background:
      "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },

  avatarWrapper: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
};