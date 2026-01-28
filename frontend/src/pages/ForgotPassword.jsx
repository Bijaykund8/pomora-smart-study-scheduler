import "../styles/ForgotPassword.css";
import heroImage from "../images/pomora-hero.png";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      alert("Reset link sent to your email!");
      setEmail("");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">

        {/* LEFT SIDE */}
        <div className="forgot-left">
          <h1>Forgot Your Password? 🔑</h1>
          <p>
            No worries! Enter your email and we’ll send you a link
            to reset your password.
          </p>
          <img src={heroImage} alt="Pomora Illustration" />
        </div>

        {/* RIGHT SIDE */}
        <div className="forgot-card">
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="forgot-btn">
              Send Reset Link
            </button>
          </form>

          <p className="back-text">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
