import Header from "../components/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  /* ================= PARALLAX ================= */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ================= TYPING EFFECT ================= */
  const word = "Pomora";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

useEffect(() => {
  let timeout;

  if (!isDeleting && displayText.length < word.length) {
    timeout = setTimeout(() => {
      setDisplayText(word.slice(0, displayText.length + 1));
    }, 180); // slower typing
  } 
  else if (!isDeleting && displayText.length === word.length) {
    timeout = setTimeout(() => setIsDeleting(true), 1800); // longer pause
  } 
  else if (isDeleting && displayText.length > 0) {
    timeout = setTimeout(() => {
      setDisplayText(word.slice(0, displayText.length - 1));
    }, 100); // slower delete
  } 
  else if (isDeleting && displayText.length === 0) {
    timeout = setTimeout(() => setIsDeleting(false), 400);
  }

  return () => clearTimeout(timeout);
}, [displayText, isDeleting]);

  return (
    <div style={styles.page}>
      <Header />

      {/* Mesh Background */}
      <div style={styles.meshBg}></div>
      <div style={styles.bgBlur}></div>

      {/* Parallax Glow */}
      <motion.div
        style={{
          ...styles.floatingLight,
          transform: `translate(${mousePosition.x * 80}px, ${
            mousePosition.y * 80
          }px)`,
        }}
      />

      <div style={styles.mainSection}>
        {/* LEFT */}
        <div style={styles.left}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={styles.heading}
          >
            Welcome to{" "}
            <span style={styles.typingWord}>
              {displayText}
              <span style={styles.cursor}>|</span>
            </span>
            
            <br />
            Your Smart Study Scheduler
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={styles.subtext}
          >
            Structured deep work sessions, adaptive study planning,
            and intelligent performance analytics — engineered for
            high achievers.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" style={styles.ctaBtn}>
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* RIGHT CARDS */}
        <div style={styles.right}>
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              whileHover={{
                rotateX: 3,
                rotateY: -3,
                scale: 1.04,
              }}
              style={styles.cardWrapper}
            >
              <div style={styles.gradientBorder}></div>

              <div style={styles.card}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={styles.icon}
                >
                  {card.icon}
                </motion.div>

                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardText}>{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= CARD DATA ================= */

const cardData = [
  {
    icon: "⏱️",
    title: "Focus Timer",
    text:
      "Scientifically structured focus cycles designed to maximize deep work and eliminate distractions.",
  },
  {
    icon: "🧠",
    title: "Smart Study Plan",
    text:
      "Adaptive AI-powered scheduling that dynamically adjusts based on workload and performance.",
  },
  {
    icon: "📊",
    title: "Progress Analytics",
    text:
      "Advanced insights, streak tracking, and performance metrics to accelerate consistent improvement.",
  },
];

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    background:
      "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)",
  },

  meshBg: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(59,130,246,0.25), transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(99,102,241,0.25), transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(147,197,253,0.18), transparent 50%)
    `,
    animation: "meshMove 18s ease-in-out infinite",
    zIndex: 0,
  },

  bgBlur: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(60px)",
    WebkitBackdropFilter: "blur(60px)",
    background: "rgba(255,255,255,0.08)",
    zIndex: 1,
  },

  floatingLight: {
    position: "absolute",
    width: "700px",
    height: "700px",
    background: "rgba(59,130,246,0.35)",
    filter: "blur(180px)",
    borderRadius: "50%",
    top: "30%",
    left: "20%",
    zIndex: 0,
  },

  mainSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 80px",
    position: "relative",
    zIndex: 2,
  },

  left: { width: "48%" },

  right: {
    width: "34%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  heading: {
    fontSize: "48px",
    fontWeight: "800",
    lineHeight: "1.2",
    color: "#0f172a",
    marginBottom: "18px",
  },

 typingWord: {
  color: "#1e3a8a", // deep professional navy
  fontWeight: "800",
},

  cursor: {
  marginLeft: "4px",
  color: "#1e3a8a",
  animation: "blink 1.4s ease-in-out infinite",
},

  subtext: {
    fontSize: "18px",
    color: "#334155",
    marginBottom: "30px",
    lineHeight: "1.6",
  },

  ctaBtn: {
    display: "inline-block",
    padding: "14px 34px",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "600",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    color: "white",
    textDecoration: "none",
    boxShadow: "0 15px 40px rgba(59,130,246,0.4)",
  },

  cardWrapper: {
    position: "relative",
    borderRadius: "18px",
    padding: "2px",
    maxWidth: "400px",
  },

  gradientBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: "20px",
    background:
      "linear-gradient(120deg, #3b82f6, #6366f1, #3b82f6)",
    backgroundSize: "200% 200%",
    animation: "borderFlow 6s linear infinite",
  },

  card: {
    position: "relative",
    borderRadius: "16px",
    padding: "18px 20px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "24px",
    marginBottom: "10px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#0f172a",
  },

  cardText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.6",
  },
};