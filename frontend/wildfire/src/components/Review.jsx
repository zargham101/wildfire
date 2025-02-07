import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/custom.css";
import ReviewImg from "../assets/review.jpg"; 
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { TextField, InputAdornment } from '@mui/material'; // Material-UI components

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    description: "",
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/review/submit-review",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000); 
        setFormData({
          name: "",
          email: "",
          country: "",
          description: "",
        });
      } else {
        alert("Failed to submit review");
      }
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        "There was an error submitting your review. Please try again later."
      );
    }
  };

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <section
        className="hero-section text-center text-white py-5"
        style={{
          backgroundColor: "#1e3d58",
          animation: "pulse 5s infinite", 
          marginBottom: "90px",
          padding: "0", 
          width: "100%", 
          height: "auto", 
          overflow: "hidden", 
        }}
      >
        <div className="container-fluid px-0">
          <h1 className="display-4">Get in Touch With Us</h1>
          <p className="lead">
            We'd love to hear your feedback and help with any inquiries!
          </p>
        </div>
      </section>

      {/* Success Popup Alert */}
      {showSuccessAlert && (
        <div
          className="alert alert-success fixed-top text-center"
          role="alert"
          style={{
            zIndex: 9999,
            marginTop: '10px',
            fontSize: '18px',
            backgroundColor: '#66BB6A', 
            color: 'white', 
            border: 'none',
            width: 'auto', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            opacity: 1, 
            transition: 'opacity 1s ease', 
            display: 'inline-block', 
            marginLeft: 'auto', 
            marginRight: 'auto', 
            maxWidth: '30%',
          }}
        >
          Review submitted successfully!
        </div>
      )}

      {/* Contact Form Section */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card p-4 border-2 border-muted shadow-lg"
            style={{ borderRadius: "8px" }}
          >
            <h3 className="text-center mb-4">Review Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <TextField
                  type="text"
                  className="form-control animated-input border-2 border-muted"
                  placeholder="John Doe"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <TextField
                  type="email"
                  className="form-control animated-input border-2 border-muted"
                  placeholder="john@example.com"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <TextField
                  type="text"
                  className="form-control animated-input border-2 border-muted"
                  placeholder="USA"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control animated-input border-2 border-muted"
                  id="description"
                  name="description"
                  placeholder="Write your message here"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <img
            src={ReviewImg}
            alt="Nature"
            className="img-fluid"
            style={{
              width: "500px", 
              height: "500px",
              borderRadius: "50%",
              objectFit: "cover", 
              marginLeft: "60px",
              marginTop: "60px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)", 
              animation: "rotate 10s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
