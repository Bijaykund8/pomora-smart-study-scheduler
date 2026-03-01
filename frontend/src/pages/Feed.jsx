import { useEffect, useState } from "react";
import FocusTimer from "./FocusTimer";
import StudyPlan from "./StudyPlan";
import Navbar from "../components/Navbar";
import ProgressStats from "../components/ProgressStats";
import ActivityFeed from "../components/ActivityFeed";
import AddTaskModal from "../components/AddTaskModal";
import API from "../api";

export default function Feed({ darkMode, setDarkMode }) {
  const [userName, setUserName] = useState("");
  const [todayTasks, setTodayTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setUserName(user.name);
  }, []);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/today");
      setTodayTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load today's tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const styles = getStyles(darkMode);

  return (
    <div style={styles.fullPage}>

      {/* ✅ NAVBAR */}
      <Navbar
        onNewTask={() => setShowModal(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* 🔥 Dashboard Section */}
      <div style={styles.page}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>

        <div style={styles.content}>

          {/* Header */}
          <div style={{ marginBottom: "25px" }}>
            <h1 style={styles.heading}>
              Welcome back, {userName || "Student"} 👋
            </h1>
            <p style={styles.subtext}>
              Let’s make today productive.
            </p>
          </div>

          {/* Main Grid */}
          <div style={styles.grid}>
            {/* LEFT SIDE */}
            <div style={styles.leftColumn}>
              <FocusTimer
                tasks={todayTasks}
                darkMode={darkMode}
              />

              <StudyPlan
                tasks={todayTasks}
                setTasks={setTodayTasks}
                refreshTasks={fetchTasks}
                onAddTask={() => setShowModal(true)}
                darkMode={darkMode}
              />
            </div>

            {/* RIGHT SIDE */}
            <div style={styles.rightColumn}>
              <ProgressStats darkMode={darkMode} />
              <ActivityFeed darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Add Task Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={() => {
            fetchTasks();
            setShowModal(false);
          }}
          darkMode={darkMode}   // ✅ ADD THIS
        />
      )}
    </div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function getStyles(darkMode) {
  return {
    fullPage: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg,#0f172a,#1e293b,#111827)"
        : "linear-gradient(135deg,#cbd5e1,#bfdbfe,#e0f2fe)",
      transition: "all 0.4s ease",
    },

    page: {
      position: "relative",
      overflow: "hidden",
      padding: "40px 60px",
    },

    content: {
      position: "relative",
      zIndex: 2,
      color: darkMode ? "#f1f5f9" : "#0f172a",
      transition: "color 0.3s ease",
    },

    heading: {
      fontSize: "32px",
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#0f172a",
    },

    subtext: {
      color: darkMode ? "#cbd5e1" : "#6b7280",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "2.2fr 1fr",
      gap: "20px",
    },

    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    orb1: {
      position: "absolute",
      width: "600px",
      height: "600px",
      background: darkMode
        ? "rgba(59,130,246,0.15)"
        : "rgba(59,130,246,0.35)",
      filter: "blur(180px)",
      borderRadius: "50%",
      top: "-250px",
      left: "-250px",
      zIndex: 1,
      animation: "float1 18s ease-in-out infinite",
    },

    orb2: {
      position: "absolute",
      width: "600px",
      height: "600px",
      background: darkMode
        ? "rgba(14,165,233,0.15)"
        : "rgba(14,165,233,0.35)",
      filter: "blur(180px)",
      borderRadius: "50%",
      bottom: "-250px",
      right: "-250px",
      zIndex: 1,
      animation: "float2 22s ease-in-out infinite",
    },
  };
}