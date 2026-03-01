import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header style={styles.header}>
      {/* Shimmer Sweep */}
      <div style={styles.shimmer}></div>

      <div style={styles.navContainer}>
        {/* LOGO */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🍅</span>
          <span style={styles.logoText}>Pomora</span>
        </div>

        {/* NAV BUTTONS */}
        <div style={styles.navButtons}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/signup" style={styles.signupBtn}>
              Sign Up
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot Password
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/* ================= DARK LUXURY STYLES ================= */

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    height: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(90deg, #8fb3d9 0%, #94b6db 50%, #b4cbe6 85%, #d7e4f5 100%)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },
  navContainer: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "relative",
    zIndex: 2,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoIcon: {
    fontSize: "34px",
  },

  logoText: {
  fontSize: "28px",
  fontWeight: "800",
  color: "#0f172a",
  letterSpacing: "1px",
},

  navButtons: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

 loginBtn: {
  padding: "10px 22px",
  borderRadius: "12px",
  background: "rgba(15, 23, 42, 0.15)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: "600",
  backdropFilter: "blur(4px)",
  transition: "all 0.3s ease",
},

signupBtn: {
  padding: "10px 22px",
  borderRadius: "12px",
  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  boxShadow: "0 8px 20px rgba(59,130,246,0.35)",
  transition: "all 0.3s ease",
},

forgotLink: {
  padding: "10px 22px",
  borderRadius: "12px",
  background: "rgba(15, 23, 42, 0.15)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: "600",
  backdropFilter: "blur(4px)",
  transition: "all 0.3s ease",
},

  /* Shimmer Sweep */
  shimmer: {
    position: "absolute",
    inset: 0,
    background: `
      linear-gradient(
        120deg,
        transparent 0%,
        rgba(255,255,255,0.06) 50%,
        transparent 100%
      )
    `,
    transform: "translateX(-100%)",
    animation: "shimmer 6s infinite",
    pointerEvents: "none",
  },
};