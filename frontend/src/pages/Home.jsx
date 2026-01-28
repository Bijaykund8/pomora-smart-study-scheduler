import Header from "../components/Header";
import "../styles/Home.css";
import heroImage from "../images/pomora-hero.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Header />

      <section className="hero">
        <div className="hero-container">
          {/* LEFT SIDE */}
          <div className="hero-text">
            <h1>
              Welcome to Pomora:
              <br />
              Your Smart Study Scheduler
            </h1>

            <p>
              Boost your productivity with the Pomodoro technique and adaptive
              study plans.
            </p>

            <Link to="/login" className="cta-btn">Get Started</Link>

          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hero-image">
            <img src={heroImage} alt="Pomora App Preview" />
          </div>
        </div>
      </section>
    </>
  );
}
