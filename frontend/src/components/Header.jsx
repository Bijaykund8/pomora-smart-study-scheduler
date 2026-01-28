import "../styles/Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="nav-container">
        {/* LOGO */}
        <div className="logo">
          <span className="logo-icon">🍅</span>
          <span className="logo-text">Pomora</span>
        </div>

        {/* NAV BUTTONS */}
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
          <Link to="/forgot-password" className="forgot-link">Forgot Password</Link>

        </div>
      </div>
    </header>
  );
}
