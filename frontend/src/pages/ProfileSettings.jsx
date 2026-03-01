import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings({ darkMode }) {
  const [user, setUser] = useState({
    name: "",
    bio: "",
    education: "",
    dob: "",
    goal: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const s = getStyles(darkMode);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  /* ================= PROFILE COMPLETION ================= */
  const calculateCompletion = () => {
    const fields = ["name", "bio", "education", "dob", "goal", "photo"];
    const filled = fields.filter((field) => user[field]).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await API.put("/users/profile", user);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/feed", { replace: true });
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  /* ================= UPLOAD PHOTO ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/users/upload-photo", formData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div style={s.page}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={s.card}
      >
        {/* LOGOUT */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={s.logoutBtn}
        >
          <LogOut size={18} />
          Logout
        </motion.button>

        <h2 style={s.title}>Profile Settings</h2>

        {/* PROFILE IMAGE */}
        <div style={s.avatarSection}>
          <div style={s.avatarWrapper}>
            {user.photo ? (
              <img src={user.photo} alt="profile" style={s.avatar} />
            ) : (
              <div style={s.avatarFallback}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <label style={s.uploadOverlay}>
              Change
              <input type="file" hidden onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div style={s.grid}>
          <input name="name" value={user.name} onChange={handleChange} placeholder="Full Name" style={s.input} />
          <input name="bio" value={user.bio} onChange={handleChange} placeholder="Short Bio" style={s.input} />
          <input name="education" value={user.education} onChange={handleChange} placeholder="Education" style={s.input} />
          <input type="date" name="dob" value={user.dob?.split("T")[0]} onChange={handleChange} style={s.input} />
          <input name="goal" value={user.goal} onChange={handleChange} placeholder="Goal of Life" style={s.inputFull} />
        </div>

        {/* PROGRESS */}
        <div style={s.progressSection}>
          <div style={s.progressBar}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.5 }}
              style={s.progressFill}
            />
          </div>
          <p style={s.progressText}>{completion}% Completed</p>
        </div>

        {/* SAVE BUTTON */}
        <button onClick={handleSave} style={s.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
}

/* ================= DYNAMIC STYLES ================= */

function getStyles(darkMode) {
  return {
    page: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg,#0f172a,#1e293b,#111827)"
        : "linear-gradient(135deg,#dbeafe,#e0f2fe,#f0f9ff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      transition: "all 0.4s ease",
    },

    card: {
      position: "relative",
      width: "600px",
      background: darkMode
        ? "linear-gradient(135deg,#1e293b,#0f172a)"
        : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: darkMode
        ? "0 20px 60px rgba(0,0,0,0.6)"
        : "0 20px 50px rgba(0,0,0,0.1)",
      border: darkMode ? "1px solid #334155" : "none",
      color: darkMode ? "#f1f5f9" : "#0f172a",
    },

    logoutBtn: {
      position: "absolute",
      top: "20px",
      right: "25px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      color: "white",
      background: "linear-gradient(135deg,#ef4444,#f97316)",
    },

    title: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "25px",
    },

    avatarSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "25px",
    },

    avatarWrapper: {
      position: "relative",
      width: "120px",
      height: "120px",
    },

    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
    },

    avatarFallback: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#2563eb",
      color: "white",
      fontSize: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    uploadOverlay: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      textAlign: "center",
      background: "rgba(0,0,0,0.6)",
      color: "white",
      padding: "6px",
      borderBottomLeftRadius: "60px",
      borderBottomRightRadius: "60px",
      cursor: "pointer",
      fontSize: "12px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
    },

    input: {
      padding: "12px",
      borderRadius: "10px",
      border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
      background: darkMode ? "#1e293b" : "white",
      color: darkMode ? "#f1f5f9" : "#0f172a",
    },

    inputFull: {
      gridColumn: "span 2",
      padding: "12px",
      borderRadius: "10px",
      border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
      background: darkMode ? "#1e293b" : "white",
      color: darkMode ? "#f1f5f9" : "#0f172a",
    },

    progressSection: {
      marginTop: "20px",
    },

    progressBar: {
      height: "10px",
      background: darkMode ? "#334155" : "#e2e8f0",
      borderRadius: "10px",
    },

    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg,#2563eb,#06b6d4)",
      borderRadius: "10px",
    },

    progressText: {
      marginTop: "8px",
      fontSize: "14px",
      color: darkMode ? "#cbd5e1" : "#475569",
    },

    saveBtn: {
      marginTop: "20px",
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg,#2563eb,#06b6d4)",
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
    },
  };
}