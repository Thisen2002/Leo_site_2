import React from "react";
import { useNavigate } from "react-router-dom"; // If using React Router
import "./Notfound.css";

function Notfound() {
  const navigate = useNavigate(); // Remove this line if not using React Router

  const handleGoHome = () => {
    window.scrollTo(0, 0); // Scroll to top before navigation
    navigate("/"); // Or use window.location.href = '/' if not using React Router
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
          <h1>404</h1>
          <div className="leo-logo-watermark">
            <img src="/leo-logo.png" alt="Leo Logo" />
          </div>
        </div>

        <h2>Oops! Page Not Found</h2>
        <p>Looks like you've wandered into uncharted territory.</p>
        <p className="sub-text">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="action-buttons">
          <button className="home-button" onClick={handleGoHome}>
            Go Back Home
          </button>
          <button
            className="contact-button"
            onClick={() => { window.scrollTo(0, 0); navigate("/contact"); }}
          >
            Contact Us
          </button>
        </div>

        <div className="helpful-links">
          <h3>Helpful Links</h3>
          <div className="links-grid">
            <a href="/about">About Us</a>
            <a href="/projects">Our Projects</a>
            <a href="/events">Events</a>
            <a href="/team">Our Team</a>
          </div>
        </div>
      </div>

      <div className="decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
}

export default Notfound;
