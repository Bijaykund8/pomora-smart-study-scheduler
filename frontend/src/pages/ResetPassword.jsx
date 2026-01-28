import "../styles/ResetPassword.css";
import heroImage from "../images/pomora-hero.png";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password
      });

      alert("Password reset successful!");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">

        {/* LEFT SIDE */}
        <div className="reset-left">
          <h1>Set a New Password 🔐</h1>
          <p>Your new password must be secure and easy to remember.</p>
          <img src={heroImage} alt="Pomora Illustration" />
        </div>

        {/* RIGHT SIDE */}
        <div className="reset-card">
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="reset-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
