import React, { useState } from "react";
import "../LandingPage.css";
import FireFighter from "../assets/firefighter 1.png";
import Stats from "../assets/Starts.png";
import Module1 from "../assets/module1.png";
import Module2 from "../assets/module2.png";
import Module3 from "../assets/module3.png";
import Module4 from "../assets/module4.png";
import Module5 from "../assets/module5.png";
import Module6 from "../assets/module6.png";
import Module7 from "../assets/module7.png";
import Module8 from "../assets/module8.png";
import Founder from "../assets/founder.png";
import Team1 from "../assets/team1.png";
import Team2 from "../assets/team2.png";
import Team3 from "../assets/team3.png";

const LandingPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div>
      {/* Section 1: Header with Smoke Effect */}
      <div className="landing-header">
        <div className="text-content">
          <h1>
            <span style={{ color: "orange" }}>WildFire</span>
            <span style={{ color: "green" }}>Watch</span>
          </h1>

          {/* First Paragraph */}
          <p
            className="tagline"
            style={{
              fontSize: "1.5rem", // Larger font size for tagline
              color: "#FF3800",
              maxWidth: "700px", // Limit width of text
              lineHeight: "1.5",
            }}
          >
            Foresee the Flames, <br />
            Safeguard the Future.
          </p>

          {/* Second Paragraph with Read More */}
          <p
            className={`description ${isExpanded ? "expanded" : "clamped"}`}
            style={{
              lineHeight: "1.5",
              color: "#333",
              maxWidth: "600px",
            }}
          >
            WildFireWatch is a cutting-edge platform designed to help teams
            optimize resources and prevent wildfires, empowering communities to
            stay safe by providing advanced tools and data-driven insights to
            ensure timely and effective action during wildfire emergencies. A
            robust, web-based platform designed specifically for predicting
            forest fires and optimizing resource allocation for fire and rescue
            services.
          </p>

          {/* Buttons */}
          <div>
            <button className="btn btn-success">Start Predicting</button>
            <button
              className="btn btn-outline-success ms-2"
              onClick={toggleText}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Firetruck with About Us */}
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2>
              <span style={{ color: "black" }}>About Us</span>{" "}
              <span style={{ color: "#FA3F0B" }}>| Who We Are</span>
            </h2>
            <p>
              WildFireWatch is a cutting-edge platform designed to protect
              communities from wildfires, empowering teams to deploy resources
              effectively and stay prepared for emergencies.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src={FireFighter}
              alt="Fire Truck"
              className="img-fluid"
              style={{ marginLeft: "120px" }}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Full-width Image */}
      <div className="full-image-section">
        <img src={Stats} alt="Statistics" className="img-fluid" />
      </div>

      {/* Section 4: Modules Section */}
      <div className="container my-5">
        {/* Section Heading */}
        <h3 className="text-start" style={{ marginLeft: "20px" }}>
          <span style={{ color: "black" }}>Our Modules</span>{" "}
          <span style={{ color: "orange" }}>| Feature Highlights</span>
        </h3>

        {/* First Row of Modules */}
        <div className="row mt-4">
          <div className="col-md-3 text-center">
            <img src={Module1} alt="Module 1" className="img-fluid mb-2" />
            <p>Incident Reports</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module2} alt="Module 2" className="img-fluid mb-2" />
            <p>Data Management</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module3} alt="Module 3" className="img-fluid mb-2" />
            <p>Fire Alerts</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module4} alt="Module 4" className="img-fluid mb-2" />
            <p>Profile Management</p>
          </div>
        </div>

        {/* Second Row of Modules */}
        <div className="row mt-4">
          <div className="col-md-3 text-center">
            <img src={Module5} alt="Module 5" className="img-fluid mb-2" />
            <p>Wildfire Risk Zones</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module6} alt="Module 6" className="img-fluid mb-2" />
            <p>Resource Planning</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module7} alt="Module 7" className="img-fluid mb-2" />
            <p>Real-Time Monitoring</p>
          </div>
          <div className="col-md-3 text-center">
            <img src={Module8} alt="Module 8" className="img-fluid mb-2" />
            <p>Advanced Forecasting</p>
          </div>
        </div>
      </div>

      {/* Section 5: Quotation Section */}
      <div>
        {/* Heading Above the Black Div */}
        <h3
          style={{
            backgroundColor: "white",
            padding: "5px 15px",
            marginLeft: "100px",
            marginRight: "80px",
            color: "black",
            textAlign: "left",
          }}
        >
          <span>Statement </span>
          <span style={{ color: "#FA3F0B" }}>| What Our Founder Say's</span>
        </h3>

        {/* Black Div */}
        <div className="my-5 bg-black w-full py-5 px-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <blockquote className="blockquote">
                "Wildfires may be inevitable, but with the right tools and
                foresight, their destruction doesn't have to be." <br />
                <footer style={{ color: "white" }}>
                  Johny Depp{" "}
                  <span style={{ color: "#FFBA00" }}>- Fire Department</span>
                </footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <img
                src={Founder}
                alt="Founder"
                className="img-fluid rounded-circle"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Team Section */}
      <div className="container text-center my-5">
        <h3>Our Team</h3>
        <div className="row mt-4">
          <div className="col-md-3">
            <img
              src={Team1}
              alt="Team 1"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="col-md-3">
            <img
              src={Team2}
              alt="Team 2"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="col-md-3">
            <img
              src={Team3}
              alt="Team 3"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="col-md-3">
            <img
              src={Team3}
              alt="Team 4"
              className="img-fluid rounded-circle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
