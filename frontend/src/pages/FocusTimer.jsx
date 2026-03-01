import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function FocusTimer({ tasks = [], darkMode }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [duration, setDuration] = useState(25 * 60);
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const [sessionStatus, setSessionStatus] = useState("Idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFire, setShowFire] = useState(false);

  const [now, setNow] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setShowColon((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const hours = now.getHours().toString().padStart(2, "0");
  const minutesNow = now.getMinutes().toString().padStart(2, "0");
  const secondsNow = now.getSeconds().toString().padStart(2, "0");

  const dayDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (tasks.length === 0) {
      setSelectedTask(null);
      setRunning(false);
      return;
    }

    if (!selectedTask || !tasks.find((t) => t._id === selectedTask._id)) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks]);

  useEffect(() => {
    if (!selectedTask) return;
    const taskTime = (selectedTask.duration || 25) * 60;
    setDuration(taskTime);
    setTime(taskTime);
    setRunning(false);
  }, [selectedTask]);

  useEffect(() => {
    let interval;
    if (running && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running, time]);

  useEffect(() => {
    if (time === 0 && running) {
      setRunning(false);
      setSessionStatus("Session Completed");
      setShowConfetti(true);
      setShowFire(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowFire(false);
      }, 4000);
    }
  }, [time, running]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const circumference = 2 * Math.PI * 70;
  const progressOffset =
    duration > 0
      ? circumference * (1 - (duration - time) / duration)
      : 0;

  const s = styles(darkMode);

  return (
    <div style={s.card}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      {/* HEADER */}
      <div style={s.header}>
        <h3>Focus Session</h3>

        <div style={s.clockContainer}>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(59,130,246,0.3)",
                "0 0 25px rgba(59,130,246,0.6)",
                "0 0 10px rgba(59,130,246,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={s.liveClock}
          >
            {hours}
            <span style={{ opacity: showColon ? 1 : 0 }}>:</span>
            {minutesNow}
            <span style={{ opacity: showColon ? 1 : 0 }}>:</span>
            {secondsNow}
          </motion.div>

          <div style={s.dateText}>{dayDate}</div>
          <div style={s.timezone}>{timezone}</div>
        </div>
      </div>

      <div style={s.container}>
        {/* TASK LIST */}
        <div style={s.taskList}>
          <h3 style={{ marginBottom: "15px" }}>Focus Tasks</h3>

          <div style={s.taskScroll}>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTask(task)}
                style={{
                  ...s.taskItem,
                  background:
                    selectedTask?._id === task._id
                      ? "rgba(59,130,246,0.15)"
                      : darkMode
                      ? "#334155"
                      : "white",
                }}
              >
                <div style={s.checkbox} />
                <div>
                  <p style={s.taskTitle}>{task.title}</p>
                  <span style={s.taskDuration}>
                    {task.duration || 25} mins
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TIMER */}
        <motion.div style={s.timerBox}>
          <motion.div
            key={sessionStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              ...s.statusText,
              color:
                sessionStatus === "Session Completed"
                  ? "#16a34a"
                  : sessionStatus === "Session Paused"
                  ? "#f59e0b"
                  : "#2563eb",
            }}
          >
            {showFire && <span style={{ marginRight: 6 }}>🔥</span>}
            {sessionStatus}
          </motion.div>

          <motion.div style={s.circleWrapper}>
            <svg width="170" height="170">
              <circle
                cx="85"
                cy="85"
                r="70"
                stroke={darkMode ? "#334155" : "#e2e8f0"}
                strokeWidth="10"
                fill="none"
              />

              <motion.circle
                cx="85"
                cy="85"
                r="70"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: progressOffset }}
                style={{
                  rotate: "-90deg",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>

            <div style={s.timerText}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          </motion.div>

          <div style={s.buttons}>
            <button
              style={{
                ...s.startBtn,
                backgroundColor: running ? "#ef4444" : "#2563eb",
              }}
              onClick={() => {
                setRunning((prev) => {
                  const newState = !prev;
                  setSessionStatus(
                    newState ? "Session Started" : "Session Paused"
                  );
                  return newState;
                });
              }}
              disabled={!selectedTask}
            >
              {running ? "Pause" : "Start"}
            </button>

            <button
              style={s.resetBtn}
              onClick={() => {
                setRunning(false);
                setTime(duration);
                setSessionStatus("Session Reset");
              }}
            >
              Reset
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function styles(darkMode) {
  return {
    /* OUTER CARD */
    card: {
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "linear-gradient(135deg,#dbeafe,#e0f2fe,#f0f9ff)",
      borderRadius: "24px",
      padding: "40px",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      boxShadow: darkMode
        ? "0 10px 40px rgba(0,0,0,0.4)"
        : "0 10px 30px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
    },

    clockContainer: { textAlign: "right" },

    liveClock: {
      padding: "6px 14px",
      borderRadius: "14px",
      background: darkMode ? "#0f172a" : "rgba(255,255,255,0.7)",
      color: "#3b82f6",
      fontWeight: "700",
      boxShadow: darkMode
        ? "0 0 15px rgba(59,130,246,0.4)"
        : "none",
    },

    dateText: { fontSize: "12px", marginTop: "4px" },

    timezone: {
      fontSize: "10px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    container: {
      display: "flex",
      gap: "40px",
    },

    /* INNER TASK CARD */
    taskList: {
      flex: 1,
      background: darkMode ? "#1e293b" : "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.4)"
        : "0 5px 20px rgba(0,0,0,0.05)",
      border: darkMode ? "1px solid #334155" : "none",
    },

    taskScroll: { maxHeight: "210px", overflowY: "auto" },

    taskItem: {
      display: "flex",
      gap: "12px",
      padding: "14px",
      borderRadius: "14px",
      cursor: "pointer",
      marginBottom: "10px",
      transition: "all 0.2s ease",
    },

    checkbox: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: "2px solid #3b82f6",
    },

    taskTitle: {
      fontWeight: 600,
      color: darkMode ? "#f1f5f9" : "#0f172a",
    },

    taskDuration: {
      fontSize: "12px",
      color: darkMode ? "#94a3b8" : "#64748b",
    },

    /* INNER TIMER CARD */
    timerBox: {
      flex: 1,
      background: darkMode ? "#1e293b" : "white",
      padding: "40px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: darkMode
        ? "0 5px 20px rgba(0,0,0,0.4)"
        : "0 5px 20px rgba(0,0,0,0.05)",
      border: darkMode ? "1px solid #334155" : "none",
    },

    statusText: {
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "20px",
    },

    circleWrapper: {
      position: "relative",
      width: "170px",
      height: "170px",
      margin: "0 auto 25px auto",
    },

    timerText: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "32px",
      fontWeight: "700",
      color: darkMode ? "#f8fafc" : "#0f172a",
    },

    buttons: {
      display: "flex",
      gap: "14px",
      justifyContent: "center",
    },

    startBtn: {
      color: "white",
      border: "none",
      padding: "10px 24px",
      borderRadius: "10px",
      cursor: "pointer",
    },

    resetBtn: {
      background: darkMode ? "#334155" : "#e2e8f0",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      border: "none",
      padding: "10px 24px",
      borderRadius: "10px",
      cursor: "pointer",
    },
  };
}