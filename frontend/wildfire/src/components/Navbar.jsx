import React from "react";
import logo from "../assets/icon.png";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container d-flex align-items-center">
        {/* Logo and Brand Name */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", marginRight: "8px", paddingBottom: "5px" }}
          />
          <span>
            <span style={{ color: "orange", fontWeight: "bold" }}>
              WildFire
            </span>
            <span style={{ color: "green", fontWeight: "bold" }}>Watch</span>
          </span>
        </a>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto align-items-center">
            <li className="nav-item">
              <a
                className="nav-link active text-success fw-bold"
                href="/"
                style={{
                  fontSize: "1rem",
                  transition: "color 0.3s ease", 
                }}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")} 
                onMouseLeave={(e) => (e.target.style.color = "#198754")} 
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-muted"
                href="/"
                style={{
                  fontSize: "1rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#FA3F0B")} 
                onMouseLeave={(e) => (e.target.style.color = "#6c757d")} 
              >
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-muted"
                href="/"
                style={{
                  fontSize: "1rem",
                  transition: "color 0.3s ease", 
                }}
                onMouseEnter={(e) => (e.target.style.color = "#FA3F0B")} 
                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Buttons */}
          <div className="d-flex">
            <button className="btn btn-success me-2 text-white px-4">
              Login
            </button>
            <button className="btn btn-outline-success px-4">Signup</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
