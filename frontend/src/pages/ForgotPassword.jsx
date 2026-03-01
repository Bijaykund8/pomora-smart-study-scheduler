import "../styles/Login.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword({ darkMode }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ================= CAPTCHA ================= */

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (!captchaText) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (dark aware)
    ctx.fillStyle = darkMode ? "#1e293b" : "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = darkMode ? "#64748b" : "#94a3b8";
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Random lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = darkMode ? "#475569" : "#64748b";
      ctx.beginPath();
      ctx.moveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.lineTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Text
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = darkMode ? "#f1f5f9" : "#1e293b";
    ctx.textBaseline = "middle";

    for (let i = 0; i < captchaText.length; i++) {
      const x = 20 + i * 25;
      const y = canvas.height / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(captchaText[i], 0, 0);
      ctx.restore();
    }
  }, [captchaText, darkMode]);

  /* ================= TIMER ================= */

  useEffect(() => {
    let interval;

    if (step === 2) {
      setTimer(60);
      setCanResend(false);

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step]);

  /* ================= API ================= */

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (captchaInput.toUpperCase() !== captchaText) {
      alert("Invalid CAPTCHA");
      generateCaptcha();
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setStep(2);
    } catch {
      alert("Error resending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword,
      });

      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    }
  };

  /* ================= UI ================= */

  return (
    <div className={`login-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="glass-card">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="login-title">Forgot Password</h2>
            <p className="login-subtitle">
              Enter your email and complete CAPTCHA.
            </p>

            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter CAPTCHA"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <canvas
                  ref={canvasRef}
                  width="200"
                  height="60"
                  style={{
                    borderRadius: "10px",
                    border: darkMode
                      ? "1px solid #334155"
                      : "1px solid #cbd5e1"
                  }}
                />
                <div
                  onClick={generateCaptcha}
                  style={{
                    marginTop: "8px",
                    color: "#2563eb",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Refresh CAPTCHA
                </div>
              </div>

              <button type="submit" className="login-btn">
                Send OTP
              </button>
            </form>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="login-title">Verify OTP</h2>
            <p className="login-subtitle">
              Enter the 6-digit OTP sent to your email.
            </p>

            <form onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Verify OTP
              </button>
            </form>

            <div style={{ marginTop: "18px", fontSize: "14px" }}>
              {canResend ? (
                <span
                  onClick={handleResendOtp}
                  style={{ color: "#2563eb", cursor: "pointer" }}
                >
                  Resend OTP
                </span>
              ) : (
                <span style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Resend OTP in {timer}s
                </span>
              )}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="login-title">Reset Password</h2>

            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Reset Password
              </button>
            </form>
          </>
        )}

        <p className="signup-text">
          Remember your password? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}