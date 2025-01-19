import React from "react";
import logo from "../assets/icon.png"

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* WildFireWatch Logo and Description */}
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{ height: "40px", marginRight: "10px", paddingBottom:"5px" }}
              />
              <h5 className="mb-0">
                <span style={{ color: "orange" }}>WildFire</span>
                <span style={{ color: "green" }}>Watch</span>
              </h5>
            </div>
            <p>
              WildFireWatch is a cutting-edge platform that protects and
              prevents wildfire risks, empowering teams to optimize the
              deployment of firefighters and resources needed to protect
              communities from the destructive impact of wildfires.
            </p>
          </div>

          {/* Services Section */}
          <div className="col-md-2">
            <h6 className="fw-bold">Service</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Support
                </a>
              </li>
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Connect
                </a>
              </li>
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-3">
            <h6 className="fw-bold">Contact</h6>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-telephone-fill me-2"></i> (617) 988-40171
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2"></i>{" "}
                <a
                  href="mailto:support@www.io"
                  className="text-white text-decoration-none"
                >
                  support@www.io
                </a>
              </li>
              <li>
                <i className="bi bi-geo-alt-fill me-2"></i> WildFireWatch HQ, OFC
                BW29 Alpha
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="col-md-3">
            <h6 className="fw-bold">Social Media</h6>
            <ul className="list-unstyled d-flex gap-3">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a href="/" className="text-white text-decoration-none">
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
              <li>
                <a href="/" className="text-white text-decoration-none">
                  <i className="bi bi-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="/" className="text-white text-decoration-none">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
